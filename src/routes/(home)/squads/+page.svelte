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



<section class="h-40 text-black brightness-150">
	<div class="flex h-full items-center justify-center">
		<h1 class="text-4xl font-bold">EA SPORTS FC 25 FUT-SAMMELHEFT</h1>
	</div>
</section>

<section class="grid grid-cols-3 gap-4 px-8 pb-4">
	<input
		type="text"
		bind:value={filterText}
		placeholder="Squad suchen..."
		class="col-start-1 w-full rounded-md bg-amber-500/60 px-4 py-2 text-lg font-bold text-stone-800 outline-none"
	/>

	<div
		class="col-start-3 flex w-full items-center justify-end gap-2 rounded-md bg-amber-500/60 px-6 text-lg font-bold text-stone-800"
	>
		Gesammelt:
		{#if $settingsStore.globalCounterWithBaseCards}
			<span>
				{Object.values($collectedCardsStore)?.reduce((acc, curr) => acc + curr.length, 0) +
					Object.values($impossibleCardsStore)?.reduce((acc, curr) => acc + curr.length, 0)} / {$allCardsStore?.length}
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
				{$allCardsStore.filter((card) => card.versionId !== 0 && card.versionId !== 1).length}
			</span>
		{/if}
	</div>
</section>

<section class="grid grid-cols-3 gap-4 px-8">
	{#if filteredSquads?.length > 0}
		{#each filteredSquads as squad}
			<button
				onclick={() => goto(`/squads/${squad.slug}/page=1`)}
				class="flex w-full cursor-pointer items-center justify-between rounded-lg bg-stone-400/70 px-4 py-2 text-white"
			>
				<div class="flex items-center gap-2">
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
					<div class="text-start">{squad.name}</div>
				</div>
				<div class="mr-2">
					{($collectedCardsStore[squad?.eaId]?.length ?? 0) +
						($impossibleCardsStore[squad?.eaId]?.length ?? 0)} / {$allCardsStore.filter(
						(card) => card.versionId === squad.eaId
					).length ?? 0}
				</div>
			</button>
		{/each}
	{:else}
		<p class="col-span-3 text-center text-gray-500">Keine Squads gefunden.</p>
	{/if}
</section>
