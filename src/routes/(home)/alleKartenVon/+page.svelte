<script>
	import { allCardsStore } from '$lib/stores/cards';
	import { versionAssetsStore } from '$lib/stores/dataStores';

	import RenderedCard from '$lib/svelte/components/renderedCard.svelte';
	import { get } from 'svelte/store';

	let searchTerm = '';

	let hoveredName = null;
	let selectedSuggestionIndex = -1;

	let playerCards = [];

	let playerNames = [];
	let matchingPlayerNames = [];
	let suggestionRefs = [];

	$: playerNames = Array.from(new Set($allCardsStore?.map((card) => card.name)));
	
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

	function getAllPlayerCards(playerName) {
		const match = $allCardsStore.find(
			(card) =>
				(card.name === playerName && (card.versionId === 0 || card.versionId === 1)) ||
				(card.name === playerName && (card.clubId === 114605 || card.clubId === 112658))
		);

		const assetId = match ? match.assetId : null;
		searchTerm = '';
		getCards(assetId);

		function getCards(assetId) {
			playerCards = Array.from(
				new Map(
					$allCardsStore
						.filter((card) => card.assetId === assetId)
						.map((card) => [card.resourceId, card])
				).values()
			).sort((a, b) => b.rating - a.rating);
		}
	}
</script>

<section class="mx-auto mt-10 max-w-[75%] rounded-lg bg-stone-500/50 px-4 py-12">
	<div
		class="relative flex w-full flex-col items-center justify-evenly gap-2 border-b-2 py-4 text-white lg:flex-row"
	>
		<div class="font-bold lg:text-xl">Zeige mir alle Karten von:</div>
		<div class="relative w-full lg:w-1/2">
			<input
				type="text"
				class={`w-full bg-stone-600/80 px-3 py-2 font-semibold brightness-125 outline-none select-none ${
					searchTerm.length > 1 ? 'rounded-t-lg' : 'rounded-lg'
				} focus:brightness-100`}
				value={displayedValue}
				placeholder="Spieler suchen ..."
				on:input={(e) => {
					searchTerm = e.target.value;
					hoveredName = null;
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						if (selectedSuggestionIndex >= 0) {
							searchTerm = matchingPlayerNames[selectedSuggestionIndex];
						}
						getAllPlayerCards(searchTerm);
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
								selectedSuggestionIndex =
									(selectedSuggestionIndex + 1) % matchingPlayerNames.length;
							}
							hoveredName = matchingPlayerNames[selectedSuggestionIndex];
						}
					}
				}}
			/>

			<div
				class="absolute top-[102%] z-50 max-h-96 w-full overflow-y-auto rounded-b-lg
			[&::-webkit-scrollbar]:w-2
			[&::-webkit-scrollbar-thumb]:bg-amber-600
			[&::-webkit-scrollbar-track]:bg-stone-600"
			>
				{#each matchingPlayerNames as playerName, index}
					<button
						on:mouseenter={() => {
							hoveredName = playerName;
							selectedSuggestionIndex = index;
						}}
						on:mouseleave={() => {
							hoveredName = null;
						}}
						on:click={() => {
							searchTerm = playerName;
							getAllPlayerCards(playerName);
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
	</div>
	<div class="mt-6 flex flex-col justify-center text-center">
		{#if playerCards?.length !== 0}
			<div class="mb-5 scale-y-120 font-black text-white lg:text-2xl">
				{playerCards[0]?.name} hat bis heute {playerCards?.length} Karten gesammelt.
			</div>
			<div class="flex flex-wrap justify-center gap-4">
				{#each playerCards as card}
					<RenderedCard
						{card}
						cardVersion={$versionAssetsStore.find((v) => v.eaId === card.versionId)}
						_isImpossible={false}
						_isNotCollected={false}
						_ignoredScale={true}
					/>
				{/each}
			</div>
		{/if}
	</div>
</section>
