<script>
	import { goto } from '$app/navigation';
	import { cardsByVersionId, cardsFilter } from '$lib/stores/cards.js';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore.js';
	import { resetCardsFilter } from '$lib/Utils.js';

	let { data, children } = $props();
	const { squadSlug, cards, versionId } = data;

	cardsFilter.update((f) => ({ ...f, versionId }));

	const cardVersion = data?.coreData?.data?.rarities?.find(
		(rarity) => rarity.eaId === data?.versionId
	);
</script>

<div
	
	style={`background-image: url(${cardVersion.eaId > 3 ? `https://cdn.easysbc.io/fc25/cards/e_${cardVersion.eaId}_0.png` : `https://cdn.easysbc.io/fc25/cards/e_${cardVersion.eaId}_0.png`}); background-size: 150%; background-position: center;`}
>
	<div
		class="relative h-screen overflow-hidden pt-4 backdrop-blur-lg backdrop-brightness-60 backdrop-grayscale-25"
		style={`color:#${cardVersion?.textColor[0]}`}
	>
		<button
			onclick={() => {
				resetCardsFilter();

				goto('/squads');
			}}
			class="absolute top-3 left-3 cursor-pointer rounded-md px-2 py-1 font-bold shadow-xl transition duration-300 hover:brightness-80 active:scale-95"
			style={`background-color:#${cardVersion?.textColor[0]}; color: #${cardVersion?.lineColor[0]}`}
			>Squad Übersicht</button
		>

		<h1 class="text-center text-5xl font-black">{squadSlug?.toUpperCase()}</h1>
		<div
			class="absolute top-3 right-3 w-max rounded-md px-2 py-1 text-3xl font-black"
			style={`background-color:#${cardVersion?.textColor[0]}; color: #${cardVersion?.lineColor[0]}`}
		>
			{($collectedCardsStore[data?.versionId]?.length ?? 0) +
				($impossibleCardsStore[data?.versionId]?.length ?? 0)} /
			{Array.from(new Map($cardsByVersionId.map((card) => [card.resourceId, card])).values())
				.length}
		</div>

		{@render children()}
	</div>
</div>
