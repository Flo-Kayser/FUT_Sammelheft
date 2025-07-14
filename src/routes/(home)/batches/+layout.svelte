<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	export let children;

	const links = [
		{ index: '1', href: 'officialBatches', label: 'Offizielle Batches' },
		{ index: '2', href: 'myBatches', label: 'Meine Teams & Batches' }
	];

	const cardVersion = {
		textColor: ['e23070'],
		lineColor: ['14004a']
	};
</script>

<section class="pt-8">
	<nav class="flex justify-center divide-x-4 px-4">
		{#each links as { href, label, index }}
			<button
				on:click={() => goto(href)}
				class={`w-1/2 cursor-pointer border-b-4 border-stone-500 text-base font-black lg:w-1/3 lg:text-3xl ${
					page.url.pathname.includes(href) ? '' : ''
				}`}
			>
				<span
					class={`flex h-full items-center justify-center py-2 transition-all duration-300 ${page.url.pathname.includes(href) ? ` -translate-y-2 rounded-lg bg-white/50 text-stone-900 opacity-100 ${index == 1 ? '-translate-x-2 shadow-[22px_17px_28px_4px_rgba(0,_0,_0,_0.1)]' : 'translate-x-2 shadow-[-22px_17px_28px_4px_rgba(0,_0,_0,_0.1)]'}` : 'bg-white/0 opacity-50 '}`}
				>
					{label}
				</span>
			</button>
		{/each}
	</nav>
    <div class="mx-8 mt-8 h-full bg-stone-400/50 rounded-lg"> 

        {@render children()}
    </div>
</section>
