<script>
    export let currentPage, totalPages
</script>
<section>

{#if totalPages > 1}
    <h2 class="text-center text-lg font-bold">Seite {currentPage} von {totalPages}</h2>

<div class="my-4 flex justify-center gap-2">
	<a
		href={`./page=${Math.max(1, Number(currentPage) - 1)}`}
		class="rounded border border-gray-300 px-3 py-1 hover:bg-gray-200"
		aria-disabled={Number(currentPage) === 1}
		style="pointer-events: {Number(currentPage) === 1 ? 'none' : 'auto'}; opacity: {Number(currentPage) === 1
			? 0.5
			: 1};"
	>
		Zurück
	</a>
	{#each Array(totalPages) as _, i}
	<a
		href={`./page=${i + 1}`}
		class="rounded border px-3 py-1 hover:bg-gray-200 {Number(currentPage) === i + 1 ? 'bg-gray-300 font-bold' : ''}"
	>
		{i + 1}
	</a>
{/each}

	<a
	href={`./page=${Math.min(Number(currentPage) + 1, totalPages)}`}
	class="rounded border border-gray-300 px-3 py-1 hover:bg-gray-200"
	aria-disabled={currentPage >= totalPages}
	style="pointer-events: {currentPage >= totalPages ? 'none' : 'auto'}; opacity: {currentPage >= totalPages ? 0.5 : 1};"
>
	Weiter
</a>

</div>
{/if}
</section>
