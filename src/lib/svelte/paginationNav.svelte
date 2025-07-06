<script>
	import { goto } from "$app/navigation";

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
</script>

<section class="mt-auto select-none" style={`color: #${cardVersion?.textColor[0]}`}>
	
	{#if totalPages > 1}
		<h2 class="text-center text-lg font-bold">Seite {currentPage} von {totalPages}</h2>

		<div class="my-4 flex justify-center gap-2 items-center">
			<!-- Zurück -->
			<button
				onclick={()=>goto(`./page=${Math.max(1, Number(currentPage) - 1)}`)}
				class="rounded border px-3 py-1 hover:brightness-150 curspor-pointer" 
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
					<span class="px-1 w-10 text-xl font-bold letter-spacing-2 text-center pointer-events-none select-none">…</span>
				{/if}
				
				<button
					onclick={()=>goto(`./page=${page}`)}
					style={`${Number(currentPage) === page ? `background-color: #${cardVersion?.lineColor[0]}`:''}`}
					class="rounded border w-10 py-1 text-center hover:brightness-150 cursor-pointer"

					
				>
					{page}
				</button>
			{/each}

			<!-- Weiter -->
			<button
				onclick={()=>goto(`./page=${Math.min(Number(currentPage) + 1, totalPages)}`)}
				class="rounded border  px-3 py-1 hover:brightness-150 cursor-pointer"
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
