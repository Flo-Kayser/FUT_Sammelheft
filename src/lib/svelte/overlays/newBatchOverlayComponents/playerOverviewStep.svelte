<script>
	import { allCardsStore } from '$lib/stores/cards';
	import SearchInput from '$lib/svelte/partials/searchInput.svelte';
	import Icon from '$lib/svelte/components/icon.svelte';
	import { versionAssetsStore } from '$lib/stores/dataStores';

	export let playersFromTemplate = [];
	export let selectedTemplate;
	export let additionalPlayers = [];
	export let excludedPlayerIds = new Set();

	export let selectedPlayers = [];

	let searchArray = Array.from(
		new Map($allCardsStore.map((card) => [card.resourceId, card])).values()
	);

	// Template-Spieler, außer Template 0
	$: effectivePlayersFromTemplate = selectedTemplate === 0 ? [] : playersFromTemplate;

	// Finaler Spieler-Pool = Template-Spieler (ohne ausgeschlossene) + manuell hinzugefügte
	$: selectedPlayers = [
		...effectivePlayersFromTemplate.filter((player) => !excludedPlayerIds.has(player.resourceId)),
		...additionalPlayers
	];

	function toggleExclusion(id) {
		const updated = new Set(excludedPlayerIds);
		if (excludedPlayerIds.has(id)) {
			updated.delete(id);
		} else {
			updated.add(id);
		}
		excludedPlayerIds = updated;
	}

	function addPlayerManuell(player) {
		if (
			!effectivePlayersFromTemplate.find((p) => p.resourceId === player.resourceId) &&
			!additionalPlayers.find((p) => p.resourceId === player.resourceId)
		) {
			additionalPlayers = [...additionalPlayers, player];
		}
	}

	function removeAdditionalPlayer(id) {
		additionalPlayers = additionalPlayers.filter((p) => p.resourceId !== id);
	}
</script>

<div class="flex h-68 flex-col gap-2 rounded border-2 border-[#61c3f0] p-4 px-10 text-white">
	<div class="flex gap-4">
		<SearchInput
			{searchArray}
			suggestionsStart={2}
			label="Spieler"
			on:select={(e) => setTimeout(() => addPlayerManuell(e.detail), 1000)}
		/>
		<div class="flex w-64 flex-col pt-2">
			<span>Nachträglich hinzugefügt:</span>
			<div class="flex h-52 flex-col overflow-y-auto py-2 pr-2 font-semibold">
				{#each additionalPlayers as player}
					<div class="flex items-center justify-between">
						<span>
							&bull; {player.name}
						</span>
						<button
							class="rotate-45 cursor-pointer text-red-500"
							on:click={() => removeAdditionalPlayer(player.resourceId)}
						>
							<Icon name="x" />
						</button>
					</div>
				{/each}
			</div>
		</div>

		{#if selectedTemplate !== 0}
			<div class="flex w-64 grow flex-col gap-2 border-l-2 pt-2 pl-4">
				<span>Aus der Vorlage:</span>
				<div class="grid h-48 grid-cols-2 gap-2 overflow-y-auto">
					{#each playersFromTemplate as player}
						<button
							class={`flex cursor-pointer items-center justify-between rounded-md border p-2 transition-opacity duration-300 ${
								excludedPlayerIds.has(player.resourceId)
									? 'opacity-30 grayscale'
									: 'hover:brightness-125'
							}`}
							on:click={() => toggleExclusion(player.resourceId)}
						>
							<div class="flex flex-col">
								<div class="flex items-center gap-2">{player?.name}</div>
								<div class="flex items-start text-xs">
									{player?.rating} -
									{$versionAssetsStore.find((squad) => squad.eaId === player?.versionId)?.name}
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
