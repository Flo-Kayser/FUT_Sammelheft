<script>
	import { allCardsStore } from '$lib/stores/cards.js';
	import { customBatchesStore } from '$lib/stores/batches.js';
	import { decodeBatchCode } from '$lib/utils/customBatchCodeGenHelper.js';
	import { insertBatch } from '$lib/utils/addCustomBatchesHelper.js';

	export let selectedTemplate;
	export let _isOverlayOpen;

	const templates = [
		{ id: 0, name: 'Keine Vorlage', description: 'Füge Spieler manuell hinzu' },
		{ id: 1, name: 'Das Ganze Team', description: 'Sammle alle Spieler eines Teams' },
		{ id: 2, name: 'Die Ganze Nation', description: 'Sammle alle Spieler einer Nation' },
		{ id: 3, name: 'Die Ganze Liga', description: 'Sammle alle Spieler einer Liga' },
		{
			id: 4,
			name: 'Alle Karten mit dem Rating ...',
			description: 'Sammle alle Spieler mit einem bestimmten Rating'
		},
		{
			id: 5,
			name: 'Beste Karte je Spieler',
			description: 'Nur die jeweils beste Version pro Spieler'
		}
	];

	let importCode = '';

	export let onChange = () => {};

	function handleSelect(id) {
		onChange(id);
	}

	function handleDecodeAndInsert() {
		try {
			const decoded = decodeBatchCode(importCode);

			if (decoded.allIds.length > 0) {
				insertBatch({
					name: decoded.name,
					allIds: decoded.allIds,
					additionalIds: decoded.additionalIds || [],
					excludedIds: decoded.excludedIds || [],
					filter: decoded.filter || {},
					templateId: decoded.templateId || 0
				});
			} else {
				alert('Kein passender Spieler gefunden.');
			}

			importCode = '';
		} catch (e) {
			alert('Ungültiger Code.');
			console.error(e);
		}

		_isOverlayOpen = false;
	}
</script>

<div class="grid w-full grid-cols-2 gap-2 px-10">
	{#each templates as template}
		<div>
			<input
				type="radio"
				checked={selectedTemplate === template.id}
				on:change={() => handleSelect(template.id)}
				class="peer hidden"
				id={template.id}
			/>
			<label
				class="flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border p-1 shadow-lg transition-all duration-300 peer-checked:scale-95 peer-checked:bg-[#61c3f0] peer-checked:text-[#2F393E] peer-checked:shadow-xl"
				for={template.id}
			>
				<span class="text-lg font-bold">{template.name}</span>
				<span class="text-sm grayscale-70">{template.description}</span>
			</label>
		</div>
	{/each}

	<div
		class="flex h-20 flex-col justify-center gap-1 rounded-md border bg-[#61c3f0] p-1 px-2 font-bold text-[#2F393E] shadow-lg transition-all duration-300"
	>
		<div class="text-xs">
			Wenn du einen Code hast, kannst du ihn hier einfügen, um die entsprechende Batch zu laden.
		</div>
		<div class="flex w-full items-center gap-1 text-xs">
			<input
				bind:value={importCode}
				type="text"
				class="font-base w-full rounded bg-[#2F393E] p-1 text-sm text-white outline-none"
			/>
			<button
				on:click={(hand) => {
					handleDecodeAndInsert();
				}}
				class="h-full cursor-pointer rounded bg-[#2F393E] px-2 text-[#61c3f0]"
			>
				Bestätigen
			</button>
		</div>
	</div>
</div>
