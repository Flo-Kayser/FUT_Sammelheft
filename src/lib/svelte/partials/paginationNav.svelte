<script>
	import { goto } from '$app/navigation';

	export let currentPage;
	export let totalPages;
	export let cardVersion;

	let pagesToShow = [];

	$: {
		const cur = Number(currentPage);
		const last = Number(totalPages);
		const pages = new Set();

		pages.add(1);
		pages.add(last);

		if (last <= 7) {
			for (let i = 1; i <= last; i++) pages.add(i);
		} else if (cur <= 3) {
			for (let i = 1; i <= 5; i++) pages.add(i);
		} else if (cur >= last - 2) {
			for (let i = last - 4; i <= last; i++) pages.add(i);
		} else {
			for (let i = cur - 1; i <= cur + 1; i++) pages.add(i);
		}

		pagesToShow = Array.from(pages).sort((a, b) => a - b);
	}

	$: textColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.topText : cardVersion?.large?.[3]?.colors?.topText);
	$: stripColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.strip : cardVersion?.large?.[3]?.colors?.strip);
	$: lineColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.lines : cardVersion?.large?.[3]?.colors?.lines);

</script>

<section
	class="absolute top-4 left-1/2 -translate-x-1/2 select-none"
	style={`color: ${textColor}`}
>
	{#if totalPages > 1}
		<h2 class="text-center text-sm font-bold lg:text-lg">Seite {currentPage} von {totalPages}</h2>

		<div class="my-4 flex items-center justify-center gap-2">
			<!-- Zurück -->
			<button
				onclick={() => goto(`./page=${Math.max(1, Number(currentPage) - 1)}`)}
				class="cursor-pointer rounded border px-3 py-1 text-xs hover:brightness-150 lg:text-base"
				aria-disabled={Number(currentPage) === 1}
				style="pointer-events: {Number(currentPage) === 1 ? 'none' : 'auto'}; opacity: {Number(
					currentPage
				) === 1
					? 0.5
					: 1};"
			>
				Zurück
			</button>

			<!-- Seitenzahlen -->
			{#each pagesToShow as page, i}
				{#if i > 0 && page - pagesToShow[i - 1] > 1}
					<span
						class="letter-spacing-2 pointer-events-none w-6 px-1 text-center text-sm font-bold select-none lg:w-10 lg:text-xl"
						>…</span
					>
				{/if}

				<button
					onclick={() => goto(`./page=${page}`)}
					style={`${Number(currentPage) === page ? `background-color: ${stripColor}` : ''}`}
					class="flex w-6 cursor-pointer items-center justify-center rounded border text-sm hover:brightness-150 lg:w-10 lg:py-1 lg:text-base"
				>
					{page}
				</button>
			{/each}

			<!-- Weiter -->
			<button
				onclick={() => goto(`./page=${Math.min(Number(currentPage) + 1, totalPages)}`)}
				class="cursor-pointer rounded border px-3 py-1 text-xs hover:brightness-150 lg:text-base"
				aria-disabled={currentPage >= totalPages}
				style="pointer-events: {currentPage >= totalPages
					? 'none'
					: 'auto'}; opacity: {currentPage >= totalPages ? 0.5 : 1};"
			>
				Weiter
			</button>
		</div>
	{/if}
</section>
