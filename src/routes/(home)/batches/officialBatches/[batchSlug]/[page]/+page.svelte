<script>
	import { browser } from '$app/environment';
	import { impossibleCardsStore, collectedCardsStore } from '$lib/stores/collectionStore.js';
	import RenderedCard from '$lib/svelte/components/renderedCard.svelte';
	import { cardsByVersionId, filteredCards, sortFilteredCardsByRating } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { highlightedCardStore, impossibleSwitchStore } from '$lib/stores/smallStores.js';
	import { onDestroy, onMount } from 'svelte';
	import { versionAssetsStore } from '$lib/stores/dataStores';
	import CardCollectAnimation from '$lib/svelte/components/cardCollectAnimation.svelte';

	import { allCardsStore } from '$lib/stores/cards.js';

	import { toggleCardState } from '$lib/utils/toggleCardState';
	import { allBatches } from '$lib/stores/batches.js';

	export let data;

	let videoElement;
	let animationTriggerCard = null;

	function playAnimation(card) {
		animationTriggerCard = null;
		if (
			$collectedCardsStore?.[card.versionId]?.includes(card.resourceId) ||
			$impossibleCardsStore?.[card.versionId]?.includes(card.resourceId) ||
			$impossibleSwitchStore === true
		)
			return;
		animationTriggerCard = card;
	}

	$: currentPage = data.currentPage;

	$: batchCardIds = $allBatches.find((batch) => batch.slug === data.batchSlug)?.allIds || [];
	$: batchCards = (() => {
		if (!$allCardsStore || !$settingsStore || !$collectedCardsStore || !$impossibleCardsStore)
			return [];

		const seen = new Set();

		return $allCardsStore.filter((card) => {
			if (!batchCardIds.includes(card.resourceId)) return false;
			if (seen.has(card.resourceId)) return false;
			seen.add(card.resourceId);

			const collected = $collectedCardsStore[card.versionId]?.includes(card.resourceId);
			const impossible = $impossibleCardsStore[card.versionId]?.includes(card.resourceId);

			const showCollected = $settingsStore.showCollectedCards && collected;
			const showUncollected = $settingsStore.showUncollectedCards && !collected && !impossible;
			const showImpossible = $settingsStore.showImpossibleCards && impossible;

			return showCollected || showUncollected || showImpossible;
		});
	})();

	$: paginatedCards = batchCards
		.sort((a, b) => b.rating - a.rating)
		.slice(
			(currentPage - 1) * $settingsStore.cardsPerPage,
			currentPage * $settingsStore.cardsPerPage
		);

	$: isCollected = paginatedCards?.map((card) => {
		const ids = $collectedCardsStore?.[card.versionId];
		return Array.isArray(ids) && ids.length > 0 ? ids.includes(card.resourceId) : false;
	});
	$: isNotImpossible = paginatedCards?.map((card) => {
		const ids = $impossibleCardsStore?.[card.versionId];
		return Array.isArray(ids) && ids.length > 0 ? ids.includes(card.resourceId) : false;
	});

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
					on:click={() => {
						playAnimation(card);
						$impossibleSwitchStore
							? toggleCardState(card, 'impossible')
							: toggleCardState(card, 'collect');
					}}
					class={`cursor-pointer  ${card.resourceId === localHighlightedId ? 'animate-pingCard' : ''}`}
				>
					<RenderedCard
						{card}
						cardVersion={$versionAssetsStore.find((v) => v.eaId === card.versionId)}
						_isImpossible={isNotImpossible[i]}
						_isNotCollected={!isCollected[i]}
					/>
				</button>
			{/each}
		</div>
	{:else}
		<p>No cards found for this squad.</p>
	{/if}
</section>

{#if $settingsStore.playAnimationOnCardCollect}
	<CardCollectAnimation playTrigger={animationTriggerCard} />
{/if}
