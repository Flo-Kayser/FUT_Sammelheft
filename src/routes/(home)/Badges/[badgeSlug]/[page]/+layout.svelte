<script>
	import { settingsStore } from '$lib/stores/settings.js';
	import { allCardsStore } from '$lib/stores/cards.js';

	import PlayerSearch from '$lib/svelte/playerSearch.svelte';
	import PaginationNav from '$lib/svelte/paginationNav.svelte';
	import PageSettings from '$lib/svelte/pageSettings.svelte';

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const cardVersion = {
		textColor: ['e23070'],
		lineColor: ['14004a']
	};

	export let data;
	export let children;

	let searchInput;

	$: currentPage = data?.currentPage;

	$: badgeTeamPlayerIds =
		data?.badges?.find((badge) => badge.slug === data?.badgeSlug)?.allPlayerItemEaIds || [];


	$: totalPages = Math.ceil(badgeTeamPlayerIds.length / settingsStore.cardsPerPage);

	$: badgeTeamPlayers =
		badgeTeamPlayerIds?.length > 0
			? badgeTeamPlayerIds.map((cardId) => {
					const match = $allCardsStore.find((c) => c.resourceId === cardId);
					return { resourceId: cardId, name: match?.name ?? 'Unbekannt' };
				})
			: [];

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
</script>

{@render children()}
<section
	class="absolute bottom-0 left-1/2 flex h-28 w-full -translate-x-1/2 justify-center bg-stone-800/60"
>
	<PlayerSearch {cardVersion} bind:inputRef={searchInput} searchArray={badgeTeamPlayers} />

	<PaginationNav {currentPage} {totalPages} {cardVersion} />

	<PageSettings {cardVersion} />
</section>
