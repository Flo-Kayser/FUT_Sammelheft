<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resetCardsFilter } from '$lib/Utils.js';
	import { impossibleSwitchStore } from '$lib/stores/smallStores.js';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore.js';
	import { allCardsStore, filteredCards } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { versionAssetsStore } from '$lib/stores/dataStores';

	let filterText = '';

	onMount(() => {
		resetCardsFilter();
		impossibleSwitchStore.set(false);
	});

	function hasVersionId(id) {
		return $allCardsStore?.some((card) => card.versionId === id);
	}

	function toggleFavoriteSquad(eaId) {
		settingsStore.update((current) => {
			const currentFavorites = current.favoriteSquads ?? [];
			const isFav = currentFavorites.includes(eaId);

			return {
				...current,
				favoriteSquads: isFav
					? currentFavorites.filter((id) => id !== eaId)
					: [...currentFavorites, eaId]
			};
		});
	}

	$: filteredSquads =
		$versionAssetsStore && $allCardsStore
			? $versionAssetsStore
					.filter((squad) => {
						const name = squad.name?.toLowerCase() ?? '';
						const query = filterText.toLowerCase();
						return name.includes(query) && hasVersionId(squad.eaId);
					})
					.sort((a, b) => {
						const favs = $settingsStore.favoriteSquads ?? [];
						const aIndex = favs.indexOf(a.eaId);
						const bIndex = favs.indexOf(b.eaId);

						const aFav = aIndex !== -1;
						const bFav = bIndex !== -1;

						if (aFav && bFav) {
							return bIndex - aIndex; 
						}
						if (aFav) return -1;
						if (bFav) return 1; 

						return a.name.localeCompare(b.name);
					})
			: [];

	$: cardsBySquad = new Map();
	$: {
		if ($allCardsStore) {
			for (const card of $allCardsStore) {
				const id = card.versionId;
				if (!cardsBySquad.has(id)) {
					cardsBySquad.set(id, new Map());
				}
				cardsBySquad.get(id).set(card.resourceId, card);
			}
		}
	}

	function getCollectedCount(includeBase) {
		const isValid = (id) => includeBase || (id !== '0' && id !== '1');
		const sum = (store) =>
			Object.entries(store)
				.filter(([id]) => isValid(id))
				.reduce((acc, [, arr]) => acc + (arr?.length ?? 0), 0);
		return sum($collectedCardsStore) + sum($impossibleCardsStore);
	}

	function getTotalCardCount(includeBase) {
		const cards = $allCardsStore;
		if (!cards || cards.length === 0) return 0;

		const filtered = includeBase
			? cards
			: cards.filter((c) => c.versionId !== 0 && c.versionId !== 1);

		const uniqueCards = new Map(filtered.map((card) => [card.resourceId, card]));

		return uniqueCards.size;
	}

	$: includeBase = $settingsStore.globalCounterWithBaseCards;
	$: collectedCount = getCollectedCount(includeBase);
	$: totalCardCount = $allCardsStore?.length > 0 ? getTotalCardCount(includeBase) : null;
</script>

<section class="h-30 text-black brightness-150">
	<div class="flex h-full items-center justify-center">
		<h1 class="text-center text-2xl font-bold lg:text-4xl">FC 25 FUT-SAMMELHEFT</h1>
	</div>
</section>

<section class="mb-4 grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-8">
	<input
		type="text"
		bind:value={filterText}
		placeholder="Nach Kartentyp suchen..."
		class="col-start-1 w-full rounded-md bg-amber-500/60 px-4 py-2 text-lg font-bold text-stone-800 outline-none"
	/>
	<div
		class="col-start-1 flex w-full items-center justify-end gap-2 rounded-md bg-amber-500/60 px-6 py-2 text-lg font-bold text-stone-800 md:py-0 lg:col-start-3"
	>
		Gesammelt: <span>
			{#if totalCardCount !== null}
				{collectedCount} / {totalCardCount}
			{:else}
				Lade...
			{/if}
		</span>
	</div>
</section>

<section class="grid grid-cols-2 gap-4 px-4 pb-8 lg:grid-cols-3 lg:px-8">
	{#if filteredSquads?.length > 0}
		{#each filteredSquads as squad}
			<div class="group/squad relative">
				<button
					on:click={() => goto(`/squads/${squad.name.replace(/\s+/g, '-')}/page=1`)}
					class="flex w-full cursor-pointer flex-col items-center justify-between rounded-lg bg-stone-400/70 px-4 py-2 text-white transition duration-300 hover:bg-stone-500/60 active:scale-95 lg:flex-row"
				>
					<div class="flex flex-col items-center gap-2 text-xs lg:flex-row lg:text-base">
						<img
							src={`https://cdn.easysbc.io/fc25/cards/e_${squad.eaId}_${squad.eaId > 3 ? 0 : 3}.png`}
							alt={squad.name}
							class="w-10"
							loading="lazy"
						/>
						<div class="text-center lg:text-start">{squad.name}</div>
					</div>
					<div class="lg:mr-2">
						{($collectedCardsStore[squad.eaId]?.length ?? 0) +
							($impossibleCardsStore[squad.eaId]?.length ?? 0)} /
						{cardsBySquad.get(squad.eaId)?.size ?? 0}
					</div>
				</button>
				<button
					on:click={() => toggleFavoriteSquad(squad.eaId)}
					class="absolute top-0 right-1 cursor-pointer lg:text-xl text-3xl"
				>
					{#if $settingsStore.favoriteSquads.includes(squad.eaId)}
						<span> ★ </span>
					{:else}
						<span class="group-hover/squad:opacity-100 lg:opacity-0">☆</span>
					{/if}
				</button>
			</div>
		{/each}
	{:else}
		<p class="col-span-3 text-center text-gray-500">Keine Squads gefunden.</p>
	{/if}
</section>
