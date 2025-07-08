<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	export let children;
</script>

<div class="min-h-screen backdrop-blur-xl select-none">
	<div class="sticky top-0 right-0 z-50 flex w-full justify-end pt-2 pr-8">
		<nav
			class="flex w-max items-center gap-4 rounded-full bg-amber-500/60 px-3 py-2 text-stone-900"
		>
			{#each [{ href: '/squads', label: 'Squadübersicht' }, { href: '/meinBereich', label: 'Mein Bereich' }, { href: '/faq', label: 'FAQ' }] as { href, label }}
				<button
					onclick={() => goto(href)}
					class={`w-40 cursor-pointer rounded-full p-2 text-center font-bold transition-all duration-300 border-2 ${page.url.pathname.includes(href) ? 'bg-white border-white' : ''}`}
					>{label}</button
				>
			{/each}
		</nav>
	</div>
	
		{@render children()}
	
</div>
