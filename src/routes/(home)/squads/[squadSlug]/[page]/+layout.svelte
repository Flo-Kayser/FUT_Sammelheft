<script>
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import { cardsByVersionId,filteredCards, cardsFilter } from '$lib/stores/cards.js';

	export let data;
	export let children;
	$: currentPage = data?.currentPage;
	$: totalPages = Math.ceil(($filteredCards?.length ?? 0) / (data?.cardsPerPage ?? 1));
    cardsFilter.subscribe(c=>console.log('cardsFilter:', c));
</script>

<a href="/squads">Squad Übersicht</a>

<PaginationNav {currentPage} {totalPages} />

<div class="bg-red-900">
    <input type="text" bind:value={$cardsFilter.league}>
</div>

{@render children()}
