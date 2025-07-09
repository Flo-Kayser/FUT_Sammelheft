<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { allCardsStore } from '$lib/stores/cards';
	import { goto } from '$app/navigation';
	export let data;

	onMount(() => {
		allCardsStore.set(data.cards);
	});
	if (typeof window !== 'undefined' && window.location.pathname === '/') {
		goto('/squads');
	}
	export let children;

	import { inject } from '@vercel/analytics';

  inject();
</script>

<div  style={`background-image: url('/rhs.jpg'); background-size: cover; background-position: 70%; background-repeat: no-repeat; background-attachment: fixed;`} class="min-h-screen">

	{@render children()}
</div>
