<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let data;
	const { coreData, cards } = data;
	const { data: core } = coreData;

	//check if there is any Card with the given versionId
	function hasVersionId(id) {
		return cards.some((card) => card.versionId === id);
	}
</script>

<section class="h-40">
	<div class="flex h-full items-center justify-center">
		<h1 class="text-4xl font-bold">Squads</h1>
	</div>
</section>
<section class="grid grid-cols-3 gap-4 p-8">
	{#each core?.rarities as squad}
		{#if hasVersionId(squad.eaId)}
			<button
				onclick={() => goto(`/squads/${squad.slug}/page=1`)}
				class="flex w-full items-center gap-4 rounded-lg border-2 p-2 cursor-pointer"
			>
				<img src={squad.compactImageUrl} alt={squad.name} class="w-10" />
				<div>{squad.name}</div>
			</button>
		{/if}
	{/each}
</section>
