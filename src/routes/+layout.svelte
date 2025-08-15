<script>
	import '../app.css';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import {
		ensureAllCardsStore,
		ensureManagerDataStore,
		ensureVersionAssetsStore,
		ensureBatchesStore
	} from '$lib/utils/initStores';

	onMount(async () => {
		await ensureAllCardsStore();
		await ensureManagerDataStore();
		await ensureVersionAssetsStore();
		await ensureBatchesStore();
	});
	if (typeof window !== 'undefined' && window.location.pathname === '/') {
		goto('/squads');
	}
	export let children;

</script>

<div
	style={`background-image: url('https://ucarecdn.com/72a68f56-1f0f-430d-87ac-e35b67901241/bg_img.png'); background-size: cover; background-position: 70%; background-repeat: no-repeat; background-attachment: fixed;`}
	class="min-h-screen"
>
	{@render children()}
</div>
