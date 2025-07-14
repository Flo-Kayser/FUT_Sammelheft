<script>
	import { goto } from '$app/navigation';
	import { cardsByVersionId, cardsFilter } from '$lib/stores/cards.js';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore.js';
	import { resetCardsFilter } from '$lib/Utils.js';
	import { versionAssetsStore } from '$lib/stores/dataStores';

	import { onMount } from 'svelte';
	import {
		ensureVersionAssetsStore,
		ensureAllCardsStore,
		ensureManagerDataStore,
		ensurePlayStylePathsStore
	} from '$lib/utils/initStores.js';
	import { text } from '@sveltejs/kit';

	export let data, children;
	const { squadSlug } = data;

	let cardVersion;

	onMount(async () => {
		await ensureVersionAssetsStore();
		await ensureAllCardsStore();
		await ensureManagerDataStore();
		await ensurePlayStylePathsStore();

		cardsFilter.update((f) => ({ ...f, versionId: cardVersion?.eaId }));
	});

	$: cardVersion = $versionAssetsStore?.find(
		(squad) => squad.name.replace(/\s+/g, '-') === data?.squadSlug
	);

	$: textColor =
		'#' +
		(cardVersion?.eaId > 3
			? cardVersion?.large?.colors?.topText
			: cardVersion?.large?.[3]?.colors?.topText);
	$: stripColor =
		'#' +
		(cardVersion?.eaId > 3
			? cardVersion?.large?.colors?.strip
			: cardVersion?.large?.[3]?.colors?.strip);
	$: lineColor =
		'#' +
		(cardVersion?.eaId > 3
			? cardVersion?.large?.colors?.lines
			: cardVersion?.large?.[3]?.colors?.lines);
</script>

<div
	style={`background-image: url(${cardVersion?.eaId > 3 ? `${cardVersion?.large?.url}` : `${cardVersion?.large?.[3]?.url}`}); background-size: 150%; background-position: center;`}
>
	<div
		class="relative h-screen overflow-hidden pt-4 backdrop-blur-lg backdrop-brightness-60 backdrop-grayscale-25"
		style={`color:${textColor}`}
	>
		<button
			onclick={() => {
				resetCardsFilter();
				goto('/squads');
			}}
			class="absolute top-3 left-3 cursor-pointer rounded-md px-2 py-1 font-bold shadow-xl transition duration-300 hover:brightness-80 active:scale-95"
			style={`background-color:${textColor}; color: ${stripColor}`}>Kartentypübersicht</button
		>

		<h1 class="mt-16 text-center text-2xl font-black lg:mt-0 lg:text-5xl">
			{squadSlug?.toUpperCase()}
		</h1>
		<div
			class="absolute top-3 right-3 w-max rounded-md px-2 py-1 text-3xl font-black"
			style={`background-color:${textColor}; color: ${stripColor}`}
		>
			{($collectedCardsStore[cardVersion?.eaId]?.length ?? 0) +
				($impossibleCardsStore[cardVersion?.eaId]?.length ?? 0)} /
			{Array.from(new Map($cardsByVersionId.map((card) => [card.resourceId, card])).values())
				.length}
		</div>

		{@render children()}
	</div>
</div>
