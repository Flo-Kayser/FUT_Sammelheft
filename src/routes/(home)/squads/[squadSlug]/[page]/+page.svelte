<script>
	import { browser } from '$app/environment';
	import { toggleCard } from '$lib/stores/collectionStore.js';
	import RenderedCard from '$lib/svelte/renderedCard.svelte';
	import { collectedCardsStore } from '$lib/stores/collectionStore.js';
	import { cardsByVersionId, filteredCards,sortFilteredCardsByRating } from '$lib/stores/cards.js';

	export let data;
	const { squadName, versionId, coreData, additionalCoreData } = data;
	const { data: core } = coreData;

	$: currentPage = data.currentPage;
	$: paginatedCards = $sortFilteredCardsByRating?.slice(
		(currentPage - 1) * data?.cardsPerPage,
		(currentPage - 1) * data?.cardsPerPage + data?.cardsPerPage
	);

	const cardVersion = core?.rarities?.find((rarity) => rarity.eaId === versionId);

	let collectedCardsByVersionId = [];

	if (browser) {
		collectedCardsStore.subscribe((c) => (collectedCardsByVersionId = c[versionId]));
	}

	$: isUncollected = paginatedCards?.map(
		(card) => !collectedCardsByVersionId?.includes(card.assetId)
	);

	function toggleCardCollection(index) {
		const assetId = paginatedCards[index].assetId;
		const currentlyUncollected = isUncollected[index];

		if (!currentlyUncollected) {
			const confirmed = confirm(
				`Do you really want to remove card ${assetId} from your collection?`
			);
			if (!confirmed) {
				console.log(`Uncollect for card ${assetId} cancelled.`);
				return;
			}
		}

		toggleCard(versionId, assetId);
	}
</script>

<section>
	{#if paginatedCards?.length > 0}
		<section class="flex flex-wrap">
			{#each paginatedCards as card, i}
				<button
					on:click={() => toggleCardCollection(i)}
					class={`relative w-64 min-w-64 cursor-pointer items-center justify-center ${isUncollected[i] ? 'opacity-80 grayscale' : ''}`}
					style={`color: #${cardVersion?.textColor[0]}`}
				>
					<RenderedCard {card} {cardVersion} {squadName} {core} {additionalCoreData} />
				</button>
			{/each}
		</section>
	{:else}
		<p>No cards found for this squad.</p>
	{/if}
</section>
