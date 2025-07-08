<script>
	import faqs from '$lib/jsonData/faqs.json';
	import { slide } from 'svelte/transition';
	let openIndex = null;

	function toggle(index) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<div class="mx-auto max-w-4xl mt-10 rounded-lg px-4 py-12 bg-stone-500/50">
	<h1 class="mb-8 px-2 text-3xl font-bold">FAQ &ndash; Häufig gestellte Fragen</h1>

	{#each faqs as faq, index}
		<div class="border-b py-4">
			<button
				class="relative w-full text-left text-lg font-semibold focus:outline-none flex gap-2 items-center cursor-pointer"
				on:click={() => toggle(index)}
			>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class={`transition-transform duration-200 ease-in-out ${openIndex === index ? 'rotate-90' : ''}`}
						
					>
						<path
							fill="currentColor"
							d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82"
						/>
					</svg>
				</div>
				{faq.question}
			</button>

			{#if openIndex === index}
				<p transition:slide class="mt-2 pl-8 text-stone-900">{faq.answer}</p>
			{/if}
		</div>
	{/each}
</div>
