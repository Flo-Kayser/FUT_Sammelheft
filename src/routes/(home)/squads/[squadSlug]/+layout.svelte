<script>
	import { cardsFilter, cardsByVersionId } from '$lib/stores/cards.js';
	import { resetCardsFilter } from '$lib/Utils.js';

	let { data, children } = $props();
	const { squadSlug, cards, versionId } = data;

	cardsFilter.update((f) => ({ ...f, versionId }));

	const cardVersion = data?.coreData?.data?.rarities?.find(
		(rarity) => rarity.eaId === data?.versionId
	);
</script>

<div
	style={`background-image: url(${cardVersion?.imageUrl}); background-size: 150%; background-position: center;`}
>
	<div
		class="relative h-screen overflow-hidden pt-4 backdrop-blur-lg backdrop-brightness-60 backdrop-grayscale-25"
		style={`color:#${cardVersion?.textColor[0]}`}
	>
		<a
			onclick={() => resetCardsFilter()}
			href="/squads"
			class="absolute top-3 left-3 rounded-md px-2 py-1 font-bold shadow-xl transition duration-300 hover:brightness-80 active:scale-95"
			style={`background-color:#${cardVersion?.textColor[0]}; color: #${cardVersion?.lineColor[0]}`}
			>Squad Übersicht</a
		>

		<h1 class="text-center text-5xl font-black">{squadSlug?.toUpperCase()}</h1>
		{@render children()}
	</div>
</div>
