<script>
	import { goto } from '$app/navigation';
	import { allBatches } from '$lib/stores/batches';
	import { allCardsStore } from '$lib/stores/cards';
	import { versionAssetsStore } from '$lib/stores/dataStores';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore';
	import RenderedCard from '$lib/svelte/components/renderedCard.svelte';
	import {
		ensureAllCardsStore,
		ensureBatchesStore,
		ensurePlayStylePathsStore,
		ensureVersionAssetsStore
	} from '$lib/utils/initStores';
	import { onMount } from 'svelte';
	$: console.log($allBatches);

	$: allBatchesTriple = $allBatches ? [...$allBatches, ...$allBatches, ...$allBatches] : [];
	$: cardsReady =
		$allCardsStore.length > 0 && $allBatches.length > 0 && $versionAssetsStore.length > 0;
	$: console.log('Cards ready:', cardsReady);
	onMount(async () => {
		await ensureBatchesStore();
		await ensureAllCardsStore();
		await ensureVersionAssetsStore();
		await ensurePlayStylePathsStore();
	});

	const colors = {
		textColor: ['e23070'],
		lineColor: ['14004a']
	};

	function findCardVersion(cardId) {
		const card = $allCardsStore.find((c) => c.resourceId === cardId);
		return $versionAssetsStore.find((v) => v.eaId === card.versionId);
	}

	function countCollectedOrImpossible(resourceIds) {
		if (!$allCardsStore || !$collectedCardsStore || !$impossibleCardsStore) return 0;

		let count = 0;

		for (const resourceId of resourceIds) {
			const card = $allCardsStore.find((c) => c.resourceId === resourceId);
			if (!card) continue;

			const versionId = card.versionId;

			const collected = $collectedCardsStore[versionId]?.includes(resourceId);
			const impossible = $impossibleCardsStore[versionId]?.includes(resourceId);

			if (collected || impossible) count++;
		}

		return count;
	}
</script>

<div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
	{#if cardsReady === true}
		{#each $allBatches as batch, index}
			<button
				on:click={() => goto(`/batches/officialBatches/${batch.slug}/page=1`)}
				class="relative flex min-h-40 cursor-pointer flex-col items-center rounded-lg border-2 pt-8 md:pt-4 border-transparent p-4 text-2xl font-black transition-all duration-300 hover:border-white lg:text-3xl {index %
					2 ===
				1
					? ' text-[#e23070] lg:text-[#14004a]'
					: 'text-[#e23070]'}"
				style={`background-image: url('https://res.cloudinary.com/dppqw6sbt/image/upload/v1752452967/bg-badges_pylnti.png'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`}
			>
				<div class="mb-4">{batch?.name}</div>
				<div class="flex flex-wrap justify-center gap-2 text-base lg:hidden">
					{#each batch.highlightedIds.slice(0, 4) as cardId}
						<RenderedCard
							card={$allCardsStore.find((c) => c.resourceId === cardId)}
							cardVersion={findCardVersion(cardId)}
							_isImpossible={false}
							_isNotCollected={false}
							_ignoredScale={true}
						/>
					{/each}
				</div>
				<div class="hidden flex-wrap justify-center gap-2 text-base lg:flex">
					{#each batch.highlightedIds as cardId}
						<RenderedCard
							card={$allCardsStore.find((c) => c.resourceId === cardId)}
							cardVersion={findCardVersion(cardId)}
							_isImpossible={false}
							_isNotCollected={false}
							_ignoredScale={true}
						/>
					{/each}
				</div>
				<div class="absolute top-2 right-2 text-lg">
					{countCollectedOrImpossible(batch.allIds)} / {batch.allIds.length}
				</div>
			</button>
		{/each}
	{/if}
</div>
