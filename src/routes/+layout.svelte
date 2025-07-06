<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { allCardsStore } from '$lib/stores/cards';
	import { goto } from '$app/navigation';
	export let data;

	onMount(() => {
		allCardsStore.set(data.cards);
		goto('/squads')
	});
	export let children;
</script>


{@render children()}
