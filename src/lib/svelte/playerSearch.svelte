<script>
	import { sortFilteredCardsByRating } from '$lib/stores/cards';
	import { goto } from '$app/navigation';
    import { highlightedCardStore } from '$lib/stores/smallStores'

	import { settingsStore } from '$lib/stores/settings';
    export let cardVersion

	let playerNames = [];

	$: playerNames = $sortFilteredCardsByRating.map((card) => card.name);

	let searchTerm = '';
	let matchingPlayerNames = [];
	$: if (searchTerm.length > 0) {
		matchingPlayerNames = playerNames.filter((name) =>
			name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	} else {
		matchingPlayerNames = [];
	}

	function findPlayerIndex() {
		const search = searchTerm.toLowerCase();
		const index = playerNames.findIndex((name) => name.toLowerCase().includes(search));
		if (index !== -1) {
            highlightedCardStore.set($sortFilteredCardsByRating[index].resourceId);
			goto(`./page=${getPlayerPageNumber(index)}`);
            searchTerm = ''
		}
	}

	function getPlayerPageNumber(index) {
		const cardsPerPage = $settingsStore.cardsPerPage || 1;
		return Math.floor(index / cardsPerPage) + 1;
	}
</script>

<div class="absolute top-1/2 left-4">
	<input
		type="text"
		class={`outline-none px-3 py-2 font-semibold ${searchTerm.length > 0 ?'rounded-b-lg':'rounded-lg'}`} style={`background-color: #${cardVersion?.lineColor[0]}; color: #${cardVersion?.textColor[0]}`}
		bind:value={searchTerm}
        placeholder="Spieler suchen"
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				findPlayerIndex();
			} else if (e.key === 'Escape') {
				searchTerm = '';
			}
		}}
	/>
	<div
		class="absolute bottom-[102%] max-h-96 w-full overflow-y-auto rounded-t-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-amber-600 [&::-webkit-scrollbar-track]:bg-stone-600"
	>
		{#each matchingPlayerNames as playerName}
			<button
				onclick={() => {
					searchTerm = playerName;
					findPlayerIndex();
				}}
				class="w-full cursor-pointer overflow-x-hidden border-t-2 bg-stone-900 px-2 py-1 text-start whitespace-nowrap text-amber-500 first:border-none hover:bg-stone-600"
			>
				{playerName}
			</button>
		{/each}
	</div>
</div>
