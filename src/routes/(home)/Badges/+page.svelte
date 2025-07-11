<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { allCardsStore } from '$lib/stores/cards';

	import { impossibleSwitchStore } from '$lib/stores/smallStores.js';

	let badgeButtons = [];
	import bgUrl from '$lib/assets/bg-images/bg-badges.png';
	import RenderedCard from '$lib/svelte/renderedCard.svelte';

	export let data;

	onMount(async () => {
		impossibleSwitchStore.set(false);

		const modules = import.meta.glob('../../../lib/jsonData/badges/*.json');

		for (const path in modules) {
			const mod = await modules[path]();
			const parts = path.split('/');
			const fileName = parts[parts.length - 1].replace('.json', '');
			const cards = mod.default || [];

			const previewCards = cards.slice(0, 6);
			const previewCardIds = previewCards.map((card) => ({
				resourceId: card.resourceId,
				versionId: card.versionId
			}));

			badgeButtons.push({
				name: mod.name || fileName,
				fileName,
				previewCardIds
			});
		}

		badgeButtons = [...badgeButtons];
	});

	let filterTerm = '';

	$: filteredBadges = data?.badges?.filter((badge) => {
		const name = badge.name?.toLowerCase() ?? '';
		const query = filterTerm.toLowerCase();
		return name.includes(query);
	});

	let highlightedCardCache = {};

	async function getHighlightedCardsForBadge(badge) {
		// schon geladen? return cached
		if (highlightedCardCache[badge.slug]) {
			return highlightedCardCache[badge.slug];
		}

		// noch keine Karten verfügbar?
		if (!$allCardsStore?.length) {
			console.warn('allCardsStore leer – warte auf Init');
			return [];
		}

		const cards = badge.highlightedPlayerItemEaIds
			.map((eaId) => $allCardsStore.find((card) => card.resourceId === eaId))
			.filter(Boolean);

		highlightedCardCache[badge.slug] = cards;
		return cards;
	}
</script>

<section class="mt-10 px-8">
	<h1 class="border-t-2 py-2 text-center text-3xl font-black text-black">Alle Badges</h1>

	<div class="mt-6 grid grid-cols-2 gap-4 px-4 pb-10">
		<div class="col-start-2 wfull flex justify-end">
			<input
				type="text"
				bind:value={filterTerm}
				placeholder="Badge suchen..."
				class="w-1/2 rounded-md  px-4 py-2 text-lg font-bold text-white outline-none"
				style={`background-image: url(${bgUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;`}
			/>
		</div>
		{#each filteredBadges as badge}
			<button
				on:click={() => goto(`/badges/${badge.slug}/page=1`)}
				class="flex cursor-pointer flex-col justify-center gap-4 rounded-lg border-2 bg-stone-400/60 p-2 py-4"
				style={`background-image: url(${bgUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;`}
			>
				<span class="text-xl font-bold text-[#e23070]">
					{badge.name.toUpperCase()}
				</span>
				{#if $allCardsStore.length > 0}
					<div class="flex flex-col justify-center gap-2">
						{#await getHighlightedCardsForBadge(badge) then highlightedCards}
							<div class="flex flex-wrap justify-center gap-2">
								{#each highlightedCards.slice(0, 5) as card}
									<RenderedCard
										_isCollected={false}
										_isImpossible={false}
										core={data.coreData.data}
										additionalCoreData={data.additionalCoreData}
										{card}
										cardVersion={data.coreData.data.rarities.find(
											(rarity) => rarity.eaId === card.versionId
										)}
										_ignoredScale={true}
									/>
								{/each}
							</div>
							<div class="flex flex-wrap justify-center gap-2">
								{#each highlightedCards.slice(5, 8) as card}
									<RenderedCard
										_isCollected={false}
										_isImpossible={false}
										core={data.coreData.data}
										additionalCoreData={data.additionalCoreData}
										{card}
										cardVersion={data.coreData.data.rarities.find(
											(rarity) => rarity.eaId === card.versionId
										)}
										_ignoredScale={true}
									/>
								{/each}
							</div>
						{/await}
					</div>
				{/if}
			</button>
		{/each}
	</div>
</section>
