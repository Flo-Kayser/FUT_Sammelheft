<script>
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { goto } from '$app/navigation';
	import { resetCardsFilter } from '$lib/Utils';
	import DropDown from '$lib/svelte/dropDown.svelte';
	import PageSettings from '$lib/svelte/pageSettings.svelte';
	import { settingsStore } from '$lib/stores/settings.js';
	import PlayerSearch from '$lib/svelte/playerSearch.svelte';

	export let data;
	export let children;

	const cardVersion = data?.coreData?.data?.rarities?.find((rarity) => rarity.eaId === data?.versionId);
	

	let _isDropdownOpen = {
		leagues: false,
		clubs: false
	};
	$: currentPage = data?.currentPage;
	$: totalPages = Math.ceil(($filteredCards?.length ?? 0) / ($settingsStore?.cardsPerPage ?? 1));

	$: leagueIds = $cardsByVersionId
		? Array.from(
				new Set($cardsByVersionId.filter((card) => card.leagueId).map((card) => card.leagueId))
			).sort((a, b) => a - b)
		: [];

	// $: clubIds = $cardsByVersionId
	// 	? Array.from(
	// 			new Set($cardsByVersionId.filter((card) => card.clubId).map((card) => card.clubId))
	// 		).sort((a, b) => a - b)
	// 	: [];
</script>

{@render children()}

<section class="absolute flex justify-center bottom-0 w-full backdrop-blur-3xl backdrop-grayscale-35 left-1/2 -translate-x-1/2 h-28">
	<PlayerSearch {cardVersion}/>

	<PaginationNav {currentPage} {totalPages} {cardVersion}/>
<!-- 
	<div class="absolute top-0 left-0 flex gap-2 flex-col">
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
	</div> -->
	<PageSettings {cardVersion}/>
</section>
