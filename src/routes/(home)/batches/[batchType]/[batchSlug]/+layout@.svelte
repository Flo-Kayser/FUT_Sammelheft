<script>
	import { allCardsStore } from '$lib/stores/cards.js';
	import { allOfficialBatchesStore, customBatchesStore } from '$lib/stores/batches.js';
	import { impossibleCardsStore, collectedCardsStore } from '$lib/stores/collectionStore.js';

	import { goto } from '$app/navigation';
	export let data, children;
	

	$: batchStore = data?.batchType === 'officialBatches' ? $allOfficialBatchesStore : data?.batchType === 'myBatches' ? $customBatchesStore : null;

	$: batchCardIds = batchStore.find((batch) => batch.slug === data.batchSlug)?.allIds || [];
	



	$: collectedCount = (() => {
		if (!$allCardsStore || !$collectedCardsStore || !batchCardIds) return 0;

		let count = 0;

		for (const resourceId of batchCardIds) {
			const card = $allCardsStore.find((c) => c.resourceId === resourceId);
			if (!card) continue;

			const versionId = card.versionId;
			if ($collectedCardsStore[versionId]?.includes(resourceId) || $impossibleCardsStore[versionId]?.includes(resourceId)) {
				count++;
			}
		}
		return count;
	})();
</script>

<div
	style={`background-image: url('https://ucarecdn.com/5f772506-991c-4043-9d69-a1510e6ca152/img_batches.png'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`}
>
	<div class="relative h-screen overflow-hidden pt-4 backdrop-brightness-75 backdrop-grayscale-25">
		<button
			onclick={() => {
				goto(`/batches/${data?.batchType}`); 
			}}
			class="absolute top-3 left-3 cursor-pointer rounded-md bg-[#e23070] px-2 py-1 font-bold text-[#19004f] shadow-xl transition duration-300 hover:brightness-80 active:scale-95"
			>Batches - Übersicht</button
		>

		<h1 class="mt-16 text-center text-2xl font-black text-[#e23070] lg:mt-0 lg:text-5xl">
			{data?.batchSlug?.toUpperCase()}
		</h1>

		<div class="absolute top-3 right-3 w-max rounded-md px-2 py-1 text-3xl font-black bg-[#e23070] text-[#19004f]">
			{collectedCount}/{batchCardIds?.length}
		</div>
		{@render children()}
	</div>
</div>
