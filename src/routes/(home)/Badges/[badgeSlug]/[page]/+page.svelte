<script>
	import { settingsStore } from '$lib/stores/settings';
	import { allCardsStore } from '$lib/stores/cards';
	import { highlightedCardStore, impossibleSwitchStore } from '$lib/stores/smallStores.js';

	import {
		collectedCardsStore,
		impossibleCardsStore,
		toggleCard
	} from '$lib/stores/collectionStore.js';

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let data;

	import RenderedCard from '$lib/svelte/renderedCard.svelte';

	import videoUrl from '$lib/assets/videos/New_Card_Unlocked_6.webm';
	let videoElement;

	function playAnimation(card, i) {
		if (
			!videoElement ||
			$collectedCardsStore?.[card.versionId]?.includes(card.resourceId) ||
			$impossibleCardsStore?.[card.versionId]?.includes(card.resourceId) ||
			$impossibleSwitchStore === true
		) {
			return;
		}
		videoElement.style.display = 'block';
		videoElement.volume = 0.2;
		videoElement.play().catch((e) => console.error('Video konnte nicht abgespielt werden', e));
	}

	$: badgeTeamPlayerIds =
		data?.badges?.find((badge) => badge.slug === data?.badgeSlug)?.allPlayerItemEaIds || [];

	$: badgeTeamPlayers =
		$allCardsStore.length > 0 && badgeTeamPlayerIds?.length > 0
			? badgeTeamPlayerIds.map((cardId) => {
					const match = $allCardsStore.find((c) => c.resourceId === cardId);
					return {
						resourceId: cardId,
						versionId: match?.versionId,
						name: match?.name ?? 'Unbekannt'
					};
				})
			: [];

	$: currentPage = data.currentPage;
	$: paginatedCards = Object.values(badgeTeamPlayers)?.slice(
		(currentPage - 1) * $settingsStore?.cardsPerPage,
		(currentPage - 1) * $settingsStore?.cardsPerPage + $settingsStore?.cardsPerPage
	);

	$: isCollected = paginatedCards?.map((card) => {
		const ids = $collectedCardsStore?.[card.versionId];
		return Array.isArray(ids) && ids.length > 0 ? ids.includes(card.resourceId) : false;
	});

	$: isNotImpossible = paginatedCards?.map((card) => {
		const ids = $impossibleCardsStore?.[card.versionId];
		return Array.isArray(ids) && ids.length > 0 ? ids.includes(card.resourceId) : false;
	});

	function toggleImpossibleState(index, versionId) {
		const resourceId = paginatedCards[index].resourceId;

		if (isCollected[index] === true) {
			console.log(`Card ${resourceId} is collected. Cannot toggle impossible state.`);
			return;
		}

		const currentlyImpossible = isNotImpossible[index];

		if (currentlyImpossible) {
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

	function toggleCollectionState(index, versionId) {
		const resourceId = paginatedCards[index].resourceId;

		if (isNotImpossible[index] === true) {
			console.log(`Card ${resourceId} is impossible. Cannot toggle collection state.`);
			return;
		}

		const currentlyUncollected = isCollected[index];

		if (currentlyUncollected) {
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

<section class="mt-10 px-8 pt-8">
	<div class="relative flex flex-wrap items-center gap-x-2">
		{#each paginatedCards as card, i}
			<button
				class={`cursor-pointer  ${card.resourceId === localHighlightedId ? 'animate-pingCard' : ''}`}
				onclick={() => {
					playAnimation(card, i);

					$impossibleSwitchStore
						? toggleImpossibleState(i, card?.versionId)
						: toggleCollectionState(i, card?.versionId);
				}}
			>
				<RenderedCard
					_isImpossible={isNotImpossible[i]}
					_isCollected={!isCollected[i]}
					core={data?.coreData?.data}
					additionalCoreData={data.additionalCoreData}
					card={$allCardsStore?.find((c) => c.resourceId === card.resourceId)}
					cardVersion={data?.coreData?.data?.rarities?.find(
						(rarity) => rarity.eaId === card.versionId
					)}
				/>
			</button>
		{/each}
	</div>
</section>

{#if $settingsStore.playAnimationOnCardCollect}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={videoElement}
		width="640"
		height="360"
		style="display: none;"
		onplay={() => {
			videoElement.style.opacity = '1';
		}}
		onended={() => {
			videoElement.style.opacity = '0';
			setTimeout(() => (videoElement.style.display = 'none'), 400);
		}}
		class="fixed -top-20 left-0 h-screen w-screen object-fill opacity-0 transition-opacity duration-500"
	>
		<source src={videoUrl} type="video/webm" />
		Dein Browser unterstützt das Video-Tag nicht.
	</video>
{/if}
