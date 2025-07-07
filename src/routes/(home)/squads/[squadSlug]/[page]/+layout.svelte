<script>
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { goto } from '$app/navigation';
	import { resetCardsFilter } from '$lib/Utils';
	import DropDown from '$lib/svelte/dropDown.svelte';
	import PageSettings from '$lib/svelte/pageSettings.svelte';
	import { settingsStore } from '$lib/stores/settings.js';
	import PlayerSearch from '$lib/svelte/playerSearch.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let data;
	export let children;

	let searchInput;

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', handleKeydown);
		}
	});
	const handleKeydown = (e) => {
		if (e.ctrlKey && e.key === 'f') {
			e.preventDefault();
			searchInput?.focus();
		} else if (e.key === 'Escape') {
			searchInput?.blur();
		} else if (e.key === 'tab') {
			e.preventDefault();
		}
	};

	onDestroy(() => {
		if (browser) window.removeEventListener('keydown', handleKeydown);
	});

	const cardVersion = data?.coreData?.data?.rarities?.find(
		(rarity) => rarity.eaId === data?.versionId
	);

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
</script>

{@render children()}

<section
	class="absolute bottom-0 left-1/2 flex h-28 w-full -translate-x-1/2 justify-center backdrop-blur-3xl backdrop-grayscale-35"
>
	<PlayerSearch {cardVersion} bind:inputRef={searchInput} />

	<PaginationNav {currentPage} {totalPages} {cardVersion} />

	<DropDown
		bind:_isDropdownOpen
		coreData={data?.coreData}
		idArray={leagueIds}
		filterEndpoint={'leagueId'}
		coreEndpoint={'leagues'}
	/>

	<PageSettings {cardVersion} />
</section>
