<script>
	import { goto } from '$app/navigation';
	import { highlightedCardStore } from '$lib/stores/smallStores';
	import { settingsStore } from '$lib/stores/settings';

	export let cardVersion;
	export let inputRef;

	export let searchArray;

	let searchTerm = '';
	let hoveredName = null;
	let selectedSuggestionIndex = -1;

	let playerNames = [];
	let matchingPlayerNames = [];
	let suggestionRefs = [];

	$: playerNames = searchArray
		? searchArray.reduce(
				(acc, card) => {
					if (!acc.seen.has(card.resourceId)) {
						acc.seen.add(card.resourceId);
						acc.names.push(card.name);
					}
					return acc;
				},
				{ seen: new Set(), names: [] }
			).names
		: [];

	$: console.log('Player names:', playerNames);

	highlightedCardStore.subscribe(v=>console.log(v))

	function normalizeString(str) {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	$: matchingPlayerNames =
		searchTerm.length > 0
			? playerNames.filter((name) => normalizeString(name).includes(normalizeString(searchTerm)))
			: [];

	$: if (searchTerm.length === 0) {
		selectedSuggestionIndex = -1;
		hoveredName = null;
	}

	$: displayedValue = hoveredName !== null ? hoveredName : searchTerm;

	$: {
		if (selectedSuggestionIndex >= 0 && suggestionRefs[selectedSuggestionIndex]) {
			suggestionRefs[selectedSuggestionIndex].scrollIntoView({
				block: 'nearest',
				behavior: 'smooth'
			});
		}
	}

	function findPlayerIndex() {
		const search = searchTerm.toLowerCase();
		const index = playerNames.findIndex((name) => name.toLowerCase().includes(search));
		console.log('Found index:', index, 'for search term:', search);
		console.log(searchArray);
		if (index !== -1) {
			goto(`./page=${getPlayerPageNumber(index)}`);
			highlightedCardStore.set(searchArray[index].resourceId);
			searchTerm = '';
			hoveredName = null;
			selectedSuggestionIndex = -1;
		}
	}

	function getPlayerPageNumber(index) {
		const cardsPerPage = $settingsStore.cardsPerPage || 1;
		return Math.floor(index / cardsPerPage) + 1;
	}

	$: textColor =
		'#' +
		(cardVersion?.eaId > 3
			? cardVersion?.large?.colors?.topText
			: cardVersion?.large?.[3]?.colors?.topText);
	$: stripColor =
		'#' +
		(cardVersion?.eaId > 3
			? cardVersion?.large?.colors?.strip
			: cardVersion?.large?.[3]?.colors?.strip);
	$: lineColor =
		'#' +
		(cardVersion?.eaId > 3
			? cardVersion?.large?.colors?.lines
			: cardVersion?.large?.[3]?.colors?.lines);
</script>

<div class="absolute bottom-2 left-2 lg:left-4">
	<input
		type="text"
		class={`px-3 py-2 font-semibold outline-none select-none ${
			searchTerm.length > 0 ? 'rounded-b-lg' : 'rounded-lg'
		} focus:brightness-125`}
		style={`background-color: ${textColor}; color: ${stripColor}`}
		value={displayedValue}
		placeholder="Spieler suchen ..."
		bind:this={inputRef}
		on:input={(e) => {
			searchTerm = e.target.value;
			hoveredName = null;
		}}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				if (selectedSuggestionIndex >= 0) {
					searchTerm = matchingPlayerNames[selectedSuggestionIndex];
				}
				findPlayerIndex();
			} else if (e.key === 'Escape') {
				searchTerm = '';
				selectedSuggestionIndex = -1;
				hoveredName = null;
			} else if (e.key === 'Tab') {
				if (matchingPlayerNames.length > 0) {
					e.preventDefault();
					if (e.shiftKey) {
						selectedSuggestionIndex =
							selectedSuggestionIndex <= 0
								? matchingPlayerNames.length - 1
								: selectedSuggestionIndex - 1;
					} else {
						selectedSuggestionIndex = (selectedSuggestionIndex + 1) % matchingPlayerNames.length;
					}
					hoveredName = matchingPlayerNames[selectedSuggestionIndex];
				}
			}
		}}
	/>

	{#if searchTerm.length < 1}
		<div
			class="absolute top-1/2 right-2 -translate-y-1/2 text-sm font-bold opacity-50"
			style={`color: ${stripColor}`}
		>
			CTRL + F
		</div>
	{/if}

	<div
		class="absolute bottom-[102%] max-h-96 w-full overflow-y-auto rounded-t-lg
			[&::-webkit-scrollbar]:w-2
			[&::-webkit-scrollbar-thumb]:bg-amber-600
			[&::-webkit-scrollbar-track]:bg-stone-600"
	>
		{#each matchingPlayerNames as playerName, index}
			<button
				bind:this={suggestionRefs[index]}
				on:mouseenter={() => {
					hoveredName = playerName;
					selectedSuggestionIndex = index;
				}}
				on:mouseleave={() => {
					hoveredName = null;
				}}
				on:click={() => {
					searchTerm = playerName;
					findPlayerIndex();
				}}
				class={`w-full cursor-pointer overflow-x-hidden border-t-2 px-2 py-1 text-start whitespace-nowrap first:border-none
					${index === selectedSuggestionIndex ? 'bg-stone-700 font-bold text-white' : 'bg-stone-900 text-amber-500'}
					hover:bg-stone-600`}
			>
				{playerName}
			</button>
		{/each}
	</div>
</div>
