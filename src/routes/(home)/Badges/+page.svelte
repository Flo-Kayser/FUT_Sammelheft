<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { allCardsStore } from '$lib/stores/cards';

	let badgeButtons = [];
	import bgUrl from '$lib/assets/bg-images/bg-badges.png';
	import RenderedCard from '$lib/svelte/renderedCard.svelte';

	export let data;

	onMount(async () => {
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
</script>

<section class="mt-10 px-8">
	<h1 class="border-t-2 py-2 text-center text-3xl font-black text-black">Alle Badges</h1>
	<div class="mb-4 grid grid-cols-2 gap-4">
		{#each badgeButtons as badge}
			<button
				on:click={() => goto(`/Badges/${badge.fileName}/page=1`)}
				class="flex cursor-pointer flex-col justify-center gap-4 rounded-lg border-2 bg-stone-400/60 p-2 text-white "
				style={`background-image: url(${bgUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;`}
			>
				<span class="text-xl font-bold text-[#e23070]">
					{badge.name.toUpperCase()}
				</span>
        <div class="flex flex-col gap-2 px-2">
          <div class="flex justify-center gap-2 flex-wrap">
            {#each badge.previewCardIds.slice(0, 4) as card, index}
              <RenderedCard
                _isCollected={false}
                _isImpossible={false}
                core={data?.coreData?.data}
                additionalCoreData={data.additionalCoreData}
                card={$allCardsStore?.find((c) => c.resourceId === card.resourceId)}
                cardVersion={data?.coreData?.data?.rarities?.find(
                  (rarity) => rarity.eaId === card.versionId
                )}
                _ignoredScale={true}
              />
            {/each}
          </div>
          {#if badge.previewCardIds.length > 4}
            <div class="flex justify-center gap-2 flex-wrap mt-1">
              {#each badge.previewCardIds.slice(4, 6) as card, index}
                <RenderedCard
                  _isCollected={false}
                  _isImpossible={false}
                  core={data?.coreData?.data}
                  additionalCoreData={data.additionalCoreData}
                  card={$allCardsStore?.find((c) => c.resourceId === card.resourceId)}
                  cardVersion={data?.coreData?.data?.rarities?.find(
                    (rarity) => rarity.eaId === card.versionId
                  )}
                  _ignoredScale={true}
                />
              {/each}
            </div>
          {/if}
        </div>
			</button>
		{/each}
	</div>
</section>
