<script>
	import { cardsFilter,cardsByVersionId } from '$lib/stores/cards.js';

	let { data, children } = $props();
    const { squadSlug, cards,versionId } = data;

    cardsFilter.update(f => ({ ...f, versionId }));
</script>

<div class="h-screen  p-4">
    <h1 class="font-black text-2xl text-center">{squadSlug?.toUpperCase()}</h1>
	{@render children()}
</div>
