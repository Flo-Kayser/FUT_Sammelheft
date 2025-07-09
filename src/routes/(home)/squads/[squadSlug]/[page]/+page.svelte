<script>
	import { browser } from '$app/environment';
	import { impossibleCardsStore, toggleCard } from '$lib/stores/collectionStore.js';
	import RenderedCard from '$lib/svelte/renderedCard.svelte';
	import { collectedCardsStore } from '$lib/stores/collectionStore.js';
	import { cardsByVersionId, filteredCards, sortFilteredCardsByRating } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { highlightedCardStore, impossibleSwitchStore } from '$lib/stores/smallStores.js';
	import { onDestroy } from 'svelte';

	export let data;

	let videoElement;

	function playAnimation(i) {
	if (
		!videoElement || 
		collectedCardsByVersionId?.includes(paginatedCards[i].resourceId) ||
		impossibleCardsByVersionId?.includes(paginatedCards[i].resourceId) ||
		$impossibleSwitchStore === true
	) {
		return;
	}
	videoElement.style.display = 'block';
	videoElement.volume = 0.2;
	videoElement.play().catch((e) => console.error('Video konnte nicht abgespielt werden', e));
}

	const { squadName, versionId, coreData, additionalCoreData } = data;
	const { data: core } = coreData;

	$: currentPage = data.currentPage;
	$: paginatedCards = $sortFilteredCardsByRating?.slice(
		(currentPage - 1) * $settingsStore?.cardsPerPage,
		(currentPage - 1) * $settingsStore?.cardsPerPage + $settingsStore?.cardsPerPage
	);

	const cardVersion = core?.rarities?.find((rarity) => rarity.eaId === versionId);

	let collectedCardsByVersionId = [];
	let impossibleCardsByVersionId = [];

	let _isImpossibleMode = true;

	if (browser) {
		collectedCardsStore.subscribe((c) => (collectedCardsByVersionId = c[versionId]));
		impossibleCardsStore.subscribe((c) => (impossibleCardsByVersionId = c[versionId]));
	}

	$: isUncollected = paginatedCards?.map(
		(card) => !collectedCardsByVersionId?.includes(card.resourceId)
	);

	$: isNotImpossible = paginatedCards?.map(
		(card) => !impossibleCardsByVersionId?.includes(card.resourceId)
	);

	function toggleImpossibleState(index) {
		const resourceId = paginatedCards[index].resourceId;

		if (isUncollected[index] === false) {
			console.log(`Card ${resourceId} is collected. Cannot toggle impossible state.`);
			return;
		}

		const currentlyImpossible = isNotImpossible[index];

		if (!currentlyImpossible) {
			const confirmed = confirm(
				`Do you really want to remove card ${resourceId} from the impossible list?`
			);
			if (!confirmed) {
				console.log(`Impossible state toggle for card ${resourceId} cancelled.`);
				return;
			}
		}

		toggleCard(impossibleCardsStore, versionId, resourceId);
	}

	function toggleCollectionState(index) {
		const resourceId = paginatedCards[index].resourceId;

		if (isNotImpossible[index] === false) {
			console.log(`Card ${resourceId} is impossible. Cannot toggle collection state.`);
			return;
		}

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

		toggleCard(collectedCardsStore, versionId, resourceId);
	}

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
		<div class="flex cursor-none flex-wrap items-center gap-x-2">
			{#each paginatedCards as card, i}
				<button
					on:click={() => {
						playAnimation(i);
						$impossibleSwitchStore ? toggleImpossibleState(i) : toggleCollectionState(i);
					}}
					class={`cursor-none  ${card.resourceId === localHighlightedId ? 'animate-pingCard' : ''}`}
					style={`color: #${cardVersion?.textColor[0]}`}
				>
					<RenderedCard
						{card}
						{cardVersion}
						{core}
						{additionalCoreData}
						_isImpossible={!isNotImpossible[i]}
						_isCollected={isUncollected[i]}
					/>
				</button>
			{/each}
		</div>
	{:else}
		<p>No cards found for this squad.</p>
	{/if}
</section>

{#if $settingsStore.playAnimationOnCardCollect}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={videoElement}
		width="640"
		height="360"
		style="display: none;"
		on:play={() => {
			videoElement.style.opacity = '1';
		}}
		on:ended={() => {
			videoElement.style.opacity = '0';
			setTimeout(() => (videoElement.style.display = 'none'), 400);
		}}
		class="fixed -top-20 left-0 h-screen w-screen object-fill opacity-0 transition-opacity duration-500"
	>
		<source src="/src/lib/assets/videos/New_Card_Unlocked_6.webm" type="video/webm" />
		Dein Browser unterstützt das Video-Tag nicht.
	</video>
{/if}
