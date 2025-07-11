<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resetCardsFilter } from '$lib/Utils.js';
	import { impossibleSwitchStore } from '$lib/stores/smallStores.js';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore.js';
	import { allCardsStore } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';

	export let data;
	const { coreData, cards } = data;
	const { data: core } = coreData;

	let filterText = '';

	onMount(() => {
		resetCardsFilter();
		impossibleSwitchStore.set(false);
	});

	function hasVersionId(id) {
		return cards.some((card) => card.versionId === id);
	}

	$: filteredSquads = core?.rarities?.filter((squad) => {
		const name = squad.name?.toLowerCase() ?? '';
		const query = filterText.toLowerCase();
		return name.includes(query) && hasVersionId(squad.eaId);
	});
</script>

<section class="h-30 text-black brightness-150">
	<div class="flex h-full items-center justify-center">
		<h1 class="text-center text-2xl font-bold lg:text-4xl">EA SPORTS FC 25 FUT-SAMMELHEFT</h1>
	</div>
</section>

<section class="mb-4 grid grid-cols-1 gap-4 px-4 lg:px-8 lg:grid-cols-3">
	<input
		type="text"
		bind:value={filterText}
		placeholder="Squad suchen..."
		class="col-start-1 w-full rounded-md bg-amber-500/60 px-4 py-2 text-lg font-bold text-stone-800 outline-none"
	/>
	<div
		class="col-start-1 flex w-full items-center justify-end gap-2 rounded-md bg-amber-500/60 px-6 py-2 text-lg font-bold text-stone-800 md:py-0 lg:col-start-3"
	>
		Gesammelt:
		{#if $settingsStore.globalCounterWithBaseCards}
			<span>
				{Object.values($collectedCardsStore).reduce((acc, arr) => acc + (arr?.length ?? 0), 0) +
					Object.values($impossibleCardsStore).reduce((acc, arr) => acc + (arr?.length ?? 0), 0)}
				/
				{Array.from(new Map($allCardsStore.map((card) => [card.resourceId, card])).values()).length}
			</span>
		{:else}
			<span>
				{Object.entries($collectedCardsStore)
					.filter(([versionId]) => versionId !== '0' && versionId !== '1')
					.reduce((sum, [, arr]) => sum + (arr?.length ?? 0), 0) +
					Object.entries($impossibleCardsStore)
						.filter(([versionId]) => versionId !== '0' && versionId !== '1')
						.reduce((sum, [, arr]) => sum + (arr?.length ?? 0), 0)}
				/
				{Array.from(
					new Map(
						$allCardsStore
							.filter((card) => card.versionId !== 0 && card.versionId !== 1)
							.map((card) => [card.resourceId, card])
					).values()
				).length}
			</span>
		{/if}
	</div>
</section>

<section class="grid grid-cols-2 gap-4 px-4 lg:px-8 pb-8 lg:grid-cols-3">
	{#if filteredSquads?.length > 0}
		{#each filteredSquads as squad}
			<button
				onclick={() => goto(`/squads/${squad.slug}/page=1`)}
				class="flex w-full cursor-pointer flex-col items-center justify-between rounded-lg bg-stone-400/70 px-4 py-2 text-white transition duration-300 hover:bg-stone-500/60 active:scale-95 lg:flex-row"
			>
				<div class="flex flex-col items-center gap-2 text-xs lg:flex-row lg:text-base">
					{#if squad.eaId > 3}
						<img
							src={`https://cdn.easysbc.io/fc25/cards/e_${squad.eaId}_0.png`}
							alt={squad.name}
							class="w-10"
						/>
					{:else}
						<img
							src={`https://cdn.easysbc.io/fc25/cards/e_${squad.eaId}_3.png`}
							alt={squad.name}
							class="w-10"
						/>
					{/if}
					<div class="text-center lg:text-start">{squad.name}</div>
				</div>
				<div class="lg:mr-2">
					{($collectedCardsStore[squad?.eaId]?.length ?? 0) +
						($impossibleCardsStore[squad?.eaId]?.length ?? 0)} /
					{Array.from(
						new Map(
							$allCardsStore
								.filter((card) => card.versionId === squad?.eaId)
								.map((card) => [card.resourceId, card])
						).values()
					).length}
				</div>
			</button>
		{/each}
	{:else}
		<p class="col-span-3 text-center text-gray-500">Keine Squads gefunden.</p>
	{/if}
</section>
