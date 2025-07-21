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
	style={`background-image: url('https://res.cloudinary.com/dppqw6sbt/image/upload/v1752453063/rhs_snxmkd.jpg'); background-size: cover; background-position: 70%; background-repeat: no-repeat; background-attachment: fixed;`}
	class="min-h-screen"
>
	{@render children()}
</div>
