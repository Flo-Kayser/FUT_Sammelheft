<script>
	import { createEventDispatcher } from 'svelte';
	import Icon from '../components/icon.svelte';
	import { versionAssetsStore } from '$lib/stores/dataStores';
	const dispatch = createEventDispatcher();

	export let searchArray = [];
	export let label = 'Spieler';
	export let bgColor = '#2F393E';
	export let textColor = ' #61c3f0';
	export let suggestionsStart = 0;


	let searchQuery = '';

	function normalizeString(str) {
		return str
			?.normalize('NFD')
			?.replace(/[\u0300-\u036f]/g, '')
			?.toLowerCase();
	}

	$: matchingSearchQueries =
		searchQuery.length > suggestionsStart && searchArray.length > 0
			? searchArray.filter((item) =>
					normalizeString(item?.name).includes(normalizeString(searchQuery))
				)
			: [];

	let animateIds = new Set();

	function triggerAnimation(id) {
		animateIds = new Set(animateIds).add(id);
		setTimeout(() => {
			const updated = new Set(animateIds);
			updated.delete(id);
			animateIds = updated;
		}, 2000);
	}
</script>

<div>
	<input
		type="text"
		bind:value={searchQuery}
		placeholder={`Suche nach ${label}`}
		class="w-64 rounded p-2 text-white outline-none"
		style={`background-color: ${textColor}; color: white;`}
	/>

	<div class="flex h-36 w-64 flex-col gap-1 overflow-y-auto pt-2">
		{#each matchingSearchQueries as item}
			<button
				on:click={() => {
					triggerAnimation(item?.id || item?.resourceId);
					dispatch('select', item);
				}}
				class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm hover:brightness-125"
				style={`background-color: ${bgColor}; color: white;`}
			>
				<div class="flex flex-col">
					<div class="flex items-center gap-2">
						{item?.name}
						{#if item?.isWomen}
							(Frauen){/if}
					</div>
					{#if item?.resourceId}
						<div class="flex items-start text-xs">
							{item?.rating}
							{$versionAssetsStore.find((squad) => squad.eaId === item?.versionId)?.name}
						</div>
					{/if}
				</div>

				<div class="flex items-center justify-center rounded border p-1 text-2xl">
					<Icon
						name="x"
						class={animateIds.has(item?.id || item?.resourceId) ? 'animate-spin' : ''}
					/>
				</div>
			</button>
		{/each}
	</div>
</div>
