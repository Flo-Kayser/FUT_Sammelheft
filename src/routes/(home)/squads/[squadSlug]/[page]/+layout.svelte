<script>
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { resetCardsFilter } from '$lib/Utils';
	import { versionAssetsStore } from '$lib/stores/dataStores';


	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	import PlayerSearch from '$lib/svelte/partials/playerSearch.svelte';
	import PaginationNav from '$lib/svelte/partials/paginationNav.svelte';
	import LeagueFilter from '$lib/svelte/partials/leagueFilter.svelte';
	import PageSettings from '$lib/svelte/partials/pageSettings.svelte';

	import { spring } from 'svelte/motion';
	import {
		ensureAllCardsStore,
		ensureVersionAssetsStore,
		ensureManagerDataStore,
		ensurePlayStylePathsStore
	} from '$lib/utils/initStores.js';
	const mouseCoords = spring({ x: 0, y: 0 });
	const onMouseMove = (event) => {
		$mouseCoords = { x: event.x, y: event.y };
	};

	export let data;
	export let children;

	let _isLeagueFilterOpen = false;
	let searchInput;
	let cardVersion;

	onMount(async () => {
		await ensureVersionAssetsStore();
		await ensureAllCardsStore();
		await ensureManagerDataStore();
		await ensurePlayStylePathsStore();

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

	let _isDropdownOpen = {
		leagues: false,
		clubs: false
	};
	$: cardVersion = $versionAssetsStore.find(
		(squad) => squad.name.replace(/\s+/g, '-') === data?.squadSlug
	);

	$: currentPage = data?.currentPage;
	$: totalPages = Math.ceil(($filteredCards?.length ?? 0) / ($settingsStore?.cardsPerPage ?? 1));
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->

{@render children()}

<section
	class="absolute bottom-0 left-1/2 flex h-42 w-full -translate-x-1/2 justify-center bg-stone-800/60 lg:h-28"
>
	<PlayerSearch {cardVersion} bind:inputRef={searchInput} searchArray={$filteredCards} />

	<PaginationNav {currentPage} {totalPages} {cardVersion} />

	<LeagueFilter bind:_isLeagueFilterOpen />

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
