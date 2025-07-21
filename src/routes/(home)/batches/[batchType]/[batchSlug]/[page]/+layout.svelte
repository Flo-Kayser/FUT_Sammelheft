<script>
	import { cardsByVersionId, filteredCards, cardsFilter } from '$lib/stores/cards.js';
	import { settingsStore } from '$lib/stores/settings.js';
	import { versionAssetsStore } from '$lib/stores/dataStores';
	import { allCardsStore } from '$lib/stores/cards.js';
	import { allOfficialBatchesStore, customBatchesStore } from '$lib/stores/batches.js';

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

	const cao = {
		textColor: ['e23070'],
		lineColor: ['19004f']
	};

	const cardVersion = {
		eaId: 17,
		large: {
			colors: {
				topText: 'e23070',
				strip: '14004a',
				lines: '19004f'
			}
		}
	};

	let _isLeagueFilterOpen = false;
	let searchInput;

	$: batchStore = data?.batchType === 'officialBatches' ? $allOfficialBatchesStore : data?.batchType === 'myBatches' ? $customBatchesStore : null;

	$: batchCardIds = batchStore.find((batch) => batch.slug === data.batchSlug)?.allIds || [];


	$: batchCards = $allCardsStore.filter((card) => batchCardIds.includes(card.resourceId));

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

	$: currentPage = data?.currentPage;
	$: totalPages = Math.ceil(batchCardIds.length / ($settingsStore?.cardsPerPage ?? 1));
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->

{@render children()}

<section
	class="absolute bottom-0 left-1/2 flex h-42 w-full -translate-x-1/2 justify-center bg-stone-800/60 lg:h-28"
>
	<PlayerSearch
		{cardVersion}
		bind:inputRef={searchInput}
		searchArray={batchCards.sort((a, b) => b.rating - a.rating)}
	/>

	<PaginationNav {currentPage} {totalPages} {cardVersion} />


	<PageSettings {cardVersion} />
</section>
