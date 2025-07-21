<script>
	export let finalPlayers = [];
	export let batchName = '';
</script>

<div class="flex h-68 flex-col gap-4 rounded border-2 border-[#61c3f0] p-4 px-10 text-white">
	<h2 class="text-lg font-bold">Fertigstellen</h2>

	<div class="flex flex-col gap-1">
		<label for="batchName" class="text-sm">Batch-Name:</label>
		<input
			id="batchName"
			type="text"
			bind:value={batchName}
			placeholder="z.B. Mein Dreamteam"
			class="rounded bg-[#61c3f0] p-2 text-[#2F393E] outline-none"
		/>
		{#if batchName.trim() === ''}
			<span class="text-sm text-red-400">Bitte gib deiner Batch einen Namen.</span>
		{/if}
	</div>

	<div class="pt-2 text-sm text-white">
		Anzahl der Spieler in deiner Batch: <strong>{finalPlayers?.length}</strong>
	</div>
</div>