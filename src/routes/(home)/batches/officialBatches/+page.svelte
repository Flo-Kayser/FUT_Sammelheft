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
	import { settingsStore } from '$lib/stores/settings';
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

	let searchTerm = '';

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

	$: filteredBatches =
		$allBatches && allCardsStore
			? $allBatches
					.filter((batch) => {
						const name = batch.name?.toLowerCase() ?? '';
						const query = searchTerm.toLowerCase();
						return name.includes(query);
					})
					.sort((a, b) => {
						const favs = $settingsStore.favoriteOfficialBatches ?? [];
						const aIndex = favs.indexOf(a.id);
						const bIndex = favs.indexOf(b.id);

						const aFav = aIndex !== -1;
						const bFav = bIndex !== -1;

						if (aFav && bFav) {
							return bIndex - aIndex;
						}
						if (aFav) return -1;
						if (bFav) return 1;

						return a.id > b.id ? -1 : 1;
					})
			: [];

	function toggleFavoriteBatches(batchId) {
		settingsStore.update((current) => {
			const currentFavorites = current.favoriteOfficialBatches ?? [];
			const isFav = currentFavorites.includes(batchId);

			return {
				...current,
				favoriteOfficialBatches: isFav
					? currentFavorites.filter((id) => id !== batchId)
					: [...currentFavorites, batchId]
			};
		});
	}
</script>

<div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
	<input
		type="text"
		bind:value={searchTerm}
		placeholder="Nach Batch / Eventteam suchen..."
		class="col-start-1 w-full rounded-lg px-4 py-2 text-lg font-bold text-white outline-none lg:col-start-2"
		style={`background-image: url('https://res.cloudinary.com/dppqw6sbt/image/upload/v1752452967/bg-badges_pylnti.png'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`}
	/>

	{#if cardsReady === true}
		{#each filteredBatches as batch, index}
			<div class="group/batch relative">
				<button
					on:click={() => goto(`/batches/officialBatches/${batch.slug}/page=1`)}
					class="relative flex min-h-40 cursor-pointer flex-col items-center rounded-lg border-2 border-transparent p-4 pt-8 text-2xl font-black transition-all duration-300 hover:border-white md:pt-4 lg:text-3xl {index %
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
				<button
					on:click={() => toggleFavoriteBatches(batch.id)}
					class="absolute top-2 left-3 cursor-pointer text-3xl text-[#e23070]"
				>
					{#if $settingsStore.favoriteOfficialBatches.includes(batch.id)}
						<span> ★ </span>
					{:else}
						<span class="group-hover/batch:opacity-100 lg:opacity-0">☆</span>
					{/if}
				</button>
			</div>
		{/each}
	{/if}
</div>
