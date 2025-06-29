<script>
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { goto } from '$app/navigation';
	import { resetCardsFilter } from '$lib/Utils';
	import DropDown from '$lib/svelte/dropDown.svelte';

	export let data;
	export let children;

	let _isDropdownOpen = {
		leagues: false,
		clubs: false
	};
	$: currentPage = data?.currentPage;
	$: totalPages = Math.ceil(($filteredCards?.length ?? 0) / (data?.cardsPerPage ?? 1));

	$: leagueIds = $cardsByVersionId
		? Array.from(
				new Set($cardsByVersionId.filter((card) => card.leagueId).map((card) => card.leagueId))
			).sort((a, b) => a - b)
		: [];

	$: clubIds = $cardsByVersionId
		? Array.from(
				new Set($cardsByVersionId.filter((card) => card.clubId).map((card) => card.clubId))
			).sort((a, b) => a - b)
		: [];
</script>

<section class="relative">
	<a onclick={() => resetCardsFilter()} href="/squads">Squad Übersicht</a>

	<PaginationNav {currentPage} {totalPages} />

	<div class="absolute top-0 right-0 flex gap-2  flex-col">
		<DropDown
			bind:_isDropdownOpen
			coreData={data?.coreData}
			idArray={leagueIds}
			filterEndpoint={'leagueId'}
			coreEndpoint={'leagues'}
		/>
		<DropDown
			bind:_isDropdownOpen
			coreData={data?.coreData}
			idArray={clubIds}
			filterEndpoint={'clubId'}
			coreEndpoint={'clubs'}
		/>
	</div>
</section>

{@render children()}
