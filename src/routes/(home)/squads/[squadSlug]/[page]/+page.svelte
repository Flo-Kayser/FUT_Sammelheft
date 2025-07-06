<script>
	import { browser } from '$app/environment';
	import { toggleCard } from '$lib/stores/collectionStore.js';
	import RenderedCard from '$lib/svelte/renderedCard.svelte';
	import { collectedCardsStore } from '$lib/stores/collectionStore.js';
	import { cardsByVersionId, filteredCards, sortFilteredCardsByRating } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { highlightedCardStore } from '$lib/stores/smallStores.js'

	export let data;
	const { squadName, versionId, coreData, additionalCoreData } = data;
	const { data: core } = coreData;

	$: currentPage = data.currentPage;
	$: paginatedCards = $sortFilteredCardsByRating?.slice(
		(currentPage - 1) * $settingsStore?.cardsPerPage,
		(currentPage - 1) * $settingsStore?.cardsPerPage + $settingsStore?.cardsPerPage
	);

	const cardVersion = core?.rarities?.find((rarity) => rarity.eaId === versionId);

	let collectedCardsByVersionId = [];

	if (browser) {
		collectedCardsStore.subscribe((c) => (collectedCardsByVersionId = c[versionId]));
	}

	$: isUncollected = paginatedCards?.map(
		(card) => !collectedCardsByVersionId?.includes(card.resourceId)
	);

	function toggleCardCollection(index) {
		const resourceId = paginatedCards[index].resourceId;
		const currentlyUncollected = isUncollected[index];

		if (!currentlyUncollected) {
			const confirmed = confirm(
				`Do you really want to remove card ${resourceId} from your collection?`
			);
			if (!confirmed) {
				console.log(`Uncollect for card ${resourceId} cancelled.`);
				return;
			}
		}

		toggleCard(versionId, resourceId);
	}

	import { onDestroy } from 'svelte';

	let localHighlightedId = null;
	let timeout;

	const unsubscribe = highlightedCardStore.subscribe((id) => {
		localHighlightedId = id;

		if (id) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				highlightedCardStore.set(null);
			}, 2000);
		}
	});

	onDestroy(() => {
		unsubscribe();
		clearTimeout(timeout);
	});
</script>

<section class="px-8 pt-8">
	{#if paginatedCards?.length > 0}
		<div class="flex flex-wrap items-center gap-x-2">
			{#each paginatedCards as card, i}
				<button
					on:click={() => toggleCardCollection(i)}
					class={`cursor-pointer  ${isUncollected[i] ? 'opacity-80 grayscale' : ''} ${card.resourceId === localHighlightedId ? 'animate-pingCard' : ''}`}
					style={`color: #${cardVersion?.textColor[0]}`}
				>
					<RenderedCard {card} {cardVersion} {squadName} {core} {additionalCoreData} />
				</button>
			{/each}
		</div>
	{:else}
		<p>No cards found for this squad.</p>
	{/if}
</section>
