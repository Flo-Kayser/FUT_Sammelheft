<script>
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { goto } from '$app/navigation';
	import { resetCardsFilter } from '$lib/Utils';

	export let data;
	export let children;
	$: currentPage = data?.currentPage;
	$: totalPages = Math.ceil(($filteredCards?.length ?? 0) / (data?.cardsPerPage ?? 1));
	$: cardsFilter.subscribe((f) => console.log('Cards Filter:', f));

	$: leagueIds = $cardsByVersionId
		? Array.from(
				new Set($cardsByVersionId.filter((card) => card.leagueId).map((card) => card.leagueId))
			)
		: [];

	$: console.log('League IDs:', leagueIds);
</script>

<a onclick={()=>resetCardsFilter()} href="/squads">Squad Übersicht</a>

<PaginationNav {currentPage} {totalPages} />

<div class="flex gap-2 bg-red-400">
	{#each leagueIds as leagueId}
		<button
			onclick={() => {
				cardsFilter.update((f) => ({ ...f, leagueId }));
			}}>{leagueId}</button
		>
	{/each}
    <button onclick={()=> resetCardsFilter()}>ALL</button>
</div>

{@render children()}
