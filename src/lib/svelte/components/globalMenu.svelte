<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let isOpen = false;

	const links = [
		{ url: 'squads', href: '/squads', label: 'Kartentypübersicht' },
		{ url: 'batches', href: '/batches/officialBatches', label: 'Batches / Eventteams' },
		{ url: 'meinBereich', href: '/meinBereich', label: 'Mein Bereich' },
		{ url: 'faq', href: '/faq', label: 'FAQ' },
		{ url: 'alleKartenVon', href: '/alleKartenVon', label: 'Alle Karten von ...' }
	];

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<div class="sticky top-0 right-0 flex w-full flex-col items-end pt-2 pr-2 lg:pr-4">
	<!-- Toggle Button -->
	<div class="flex h-14 justify-end lg:hidden">
		<button
			on:click={toggleMenu}
			class="cursor-pointer rounded-xl bg-amber-500 px-4 py-2 text-xl font-bold text-stone-900"
		>
			{isOpen ? '✕ Menü schließen' : '☰ Menü'}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if isOpen}
		<nav
			class="absolute top-18 flex flex-col items-end gap-2 rounded-xl bg-amber-500 p-4 lg:hidden"
		>
			{#each links as { href, label, url }}
				<button
					on:click={() => {
						goto(href);
						isOpen = false;
					}}
					class={`w-full cursor-pointer rounded-full border-2 px-4 py-2 text-center font-bold whitespace-nowrap transition-all duration-300 ${$page.url.pathname.includes(url) ? 'border-white bg-white' : ''}`}
				>
					{label}
				</button>
			{/each}
		</nav>
	{/if}

	<!-- Desktop Menu -->
	<nav
		class="hidden w-max items-center gap-4 rounded-full bg-amber-500/60 px-3 py-2 text-stone-900 lg:flex"
	>
		{#each links as { href, label, url }}
			<button
				on:click={() => goto(href)}
				class={`w-44 cursor-pointer rounded-full border-2 p-2 text-center text-sm font-bold whitespace-nowrap transition-all duration-300 2xl:w-52 2xl:text-base ${$page.url.pathname.includes(url) ? 'border-white bg-white' : ''}`}
			>
				{label}
			</button>
		{/each}
	</nav>
</div>
