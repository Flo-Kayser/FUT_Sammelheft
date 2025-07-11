<script>
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { resetCardsFilter } from '$lib/Utils';

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	import PlayerSearch from '$lib/svelte/playerSearch.svelte';
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import DropDown from '$lib/svelte/dropDown.svelte';
	import PageSettings from '$lib/svelte/pageSettings.svelte';

	import { spring } from 'svelte/motion';
	const mouseCoords = spring({ x: 0, y: 0 });
	const onMouseMove = (event) => {
		$mouseCoords = { x: event.x, y: event.y };
	};

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


<!-- svelte-ignore element_invalid_self_closing_tag -->

{@render children()}

<section
	class="absolute bottom-0 left-1/2 flex h-28 w-full -translate-x-1/2  justify-center bg-stone-800/60"
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

<style>
	.cursor {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 1000;
		width: 25px;
		height: 25px;
		border-radius: 50%;

		background: #ffffff;
		background: radial-gradient(circle, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0) 88%);

		transform: translate(-50%, -50%) translate(var(--x, 0px), var(--y, 0px));
	}
</style>
