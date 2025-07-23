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
	import { allOfficialBatchesStore, customBatchesStore } from '$lib/stores/batches.js';

	export let data;

	let videoElement;
	let animationTriggerCard = null;

	function playAnimation(card) {
		animationTriggerCard = null;

		if (
			$collectedCardsStore?.[card.versionId]?.includes(card.resourceId) ||
			$impossibleCardsStore?.[card.versionId]?.includes(card.resourceId) ||
			$impossibleSwitchStore === true ||
			$settingsStore.playAnimationOnCardCollect === false
		)
			return;

		const cardElement = document.querySelector(`[data-card-id="${card.resourceId}"]`);
		if (!cardElement) return;

		const rect = cardElement.getBoundingClientRect();

		const clone = cardElement.cloneNode(true);
		Object.assign(clone.style, {
			position: 'fixed',
			top: `${rect.top}px`,
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			zIndex: '1000',
			transformOrigin: 'center',
			pointerEvents: 'none',
			transition: 'transform 0.6s ease-in-out'
		});

		clone.querySelectorAll('*').forEach((el) => {
			el.style.setProperty('filter', 'none', 'important');
			el.style.setProperty('opacity', '1', 'important');
			el.classList.remove('grayscale-100', 'grayscale-200', 'opacity-80', 'brightness-50');
		});

		document.body.appendChild(clone);

		const targetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
		const targetY = window.innerHeight / 3 - (rect.top + rect.height / 2);

		let scale = 1.5;

		if (window.innerWidth < 640) {
			scale = 1.1; // mobile
		} else if (window.innerWidth < 1024) {
			scale = 1.3; // tablet
		} else {
			scale = 1.5; // desktop
		}

		requestAnimationFrame(() => {
			clone.style.transform = `translate(0px, 0px) scale(1) rotateY(0deg)`;
		});

		setTimeout(() => {
			clone.style.transform = `translate(${targetX}px, ${targetY}px) scale(${scale}) rotateY(360deg)`;

			animationTriggerCard = card;
		}, 100);
		setTimeout(() => {
			clone.style.transform = `translate(0px, 0px) scale(1) rotateY(0deg)`;
		}, 3300);

		setTimeout(() => {
			clone.remove();
			animationTriggerCard = null;
		}, 4000);
	}

	$: currentPage = data.currentPage;

	$: batchStore =
		data?.batchType === 'officialBatches'
			? $allOfficialBatchesStore
			: data?.batchType === 'myBatches'
				? $customBatchesStore
				: null;

	$: batchCardIds = batchStore.find((batch) => batch.slug === data.batchSlug)?.allIds || [];
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
			timeout = setTimeout(
				() => {
					highlightedCardStore.set(null);
				},
				$settingsStore?.highlightDurationInSec * 1000 || 2000
			);
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
					data-card-id={card.resourceId}
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
	<CardCollectAnimation
		playTrigger={animationTriggerCard}
		on:done={() => (animationTriggerCard = null)}
	/>
{/if}
