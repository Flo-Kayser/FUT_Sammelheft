<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { allCardsStore } from '$lib/stores/cards';
	export let data;

	onMount(() => {
		allCardsStore.set(data.cards);
	});
	export let children;
</script>


{@render children()}
