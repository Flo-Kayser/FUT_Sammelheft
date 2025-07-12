<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let isOpen = false;

	const links = [
		{ href: '/squads', label: 'Squadübersicht' },
		{ href: '/Badges', label: 'Badges' },
		{ href: '/meinBereich', label: 'Mein Bereich' },
		{ href: '/faq', label: 'FAQ' },
		{ href: '/alleKartenVon', label: 'Alle Karten von ...' }
	];

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<div class="sticky top-0 right-0 w-full pt-2 flex pr-2 lg:pr-4 flex-col items-end z-100" >
	<!-- Toggle Button -->
	<div class="flex justify-end lg:hidden h-14">
		<button on:click={toggleMenu} class="rounded-xl text-xl bg-amber-500 px-4 py-2 font-bold text-stone-900">
			{isOpen ? '✕ Menü schließen' : '☰ Menü'}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if isOpen}
		<nav class="absolute top-18 flex flex-col items-end gap-2 rounded-xl bg-amber-500 p-4 lg:hidden">
			{#each links as { href, label }}
				<button
					on:click={() => { goto(href); isOpen = false; }}
					class={`w-full rounded-full border-2 text-center px-4 py-2 cursor-pointer font-bold transition-all duration-300 ${$page.url.pathname.includes(href) ? 'border-white bg-white' : ''}`}
				>
					{label}
				</button>
			{/each}
		</nav>
	{/if}

	<!-- Desktop Menu -->
	<nav class="hidden lg:flex w-max items-center gap-4 rounded-full bg-amber-500/60 px-3 py-2 text-stone-900">
		{#each links as { href, label }}
			<button
				on:click={() => goto(href)}
				class={`w-44 cursor-pointer rounded-full border-2 p-2 text-center font-bold transition-all duration-300 ${$page.url.pathname.includes(href) ? 'border-white bg-white' : ''}`}
			>
				{label}
			</button>
		{/each}
	</nav>
</div>
