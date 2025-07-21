<script>
	import SearchInput from '$lib/svelte/partials/searchInput.svelte';
	import Icon from '$lib/svelte/components/icon.svelte';
	import { managerDataStore } from '$lib/stores/dataStores';

	import { fade, slide } from 'svelte/transition';

	export let selectedTemplate;
	export let selectedClubs = [];
	export let selectedNations = [];
	export let selectedLeagues = [];
	export let selectedRating;
	export let withBaseCards = false;
	export let includeGold = false;
	export let includeSilver = false;
	export let includeBronze = false;
	export let _isMinRating = false;
	export let minRating = 40;

	export let includeMen = true;
	export let includeWomen = true;

	export let onClubAdd = (club) => {};
	export let onClubRemove = (clubId) => {};
	export let onNationAdd = (nation) => {};
	export let onNationRemove = (nationId) => {};
	export let onLeagueAdd = (league) => {};
	export let onLeagueRemove = (leagueId) => {};

	$: templateConfigs = {
		1: {
			label: 'deinem Team',
			list: selectedClubs,
			data: $managerDataStore.clubs,
			add: onClubAdd,
			remove: onClubRemove,
			isWomenKey: 'isWomen'
		},
		2: {
			label: 'deiner Nation (eng)',
			list: selectedNations,
			data: $managerDataStore.countries,
			add: onNationAdd,
			remove: onNationRemove
		},
		3: {
			label: 'deiner Liga',
			list: selectedLeagues,
			data: $managerDataStore.leagues,
			add: onLeagueAdd,
			remove: onLeagueRemove
		},
		4: {},
		5: {}
	};

	$: config = templateConfigs[selectedTemplate];
</script>

{#if config}
	<div class="flex h-68 gap-2 rounded border-2 border-[#61c3f0] p-4 px-10 text-white">
		{#if selectedTemplate <= 3}
			<div class="flex gap-8">
				<SearchInput
					searchArray={config.data}
					label={config.label}
					on:select={(e) => setTimeout(() => config.add(e.detail), 1000)}
				/>

				<div class="flex w-64 flex-col pt-2">
					<span>Hinzugefügt:</span>
					<div class="flex h-52 flex-col overflow-y-auto py-2 pr-2 font-semibold">
						{#each config.list as id}
							<div class="flex items-center justify-between">
								<span>
									&bull; {config.data.find((c) => c.id === id)?.name}
									{#if config.isWomenKey && config.data.find((c) => c.id === id)?.[config.isWomenKey]}
										(Frauen)
									{/if}
								</span>
								<button
									class="rotate-45 cursor-pointer text-red-500"
									on:click={() => config.remove(id)}
								>
									<Icon name="x" />
								</button>
							</div>
						{/each}
					</div>
				</div>
				<div class="flex h-full grow flex-col gap-2 border-l pl-10 text-white">
					<label class="flex items-center gap-2 divide-x-2 pt-4">
						<span class="pr-2">Möchtest du Base-Karten einbeziehen?</span>
						<input type="checkbox" bind:checked={withBaseCards} />
					</label>
					{#if withBaseCards}
						<div class="flex gap-8 divide-x-2" transition:slide>
							<div
								class="flex flex-col gap-1 py-2 pr-8 text-sm *:flex *:w-20 *:items-center *:justify-between *:gap-1"
							>
								<label>
									Gold:
									<input type="checkbox" bind:checked={includeGold} />
								</label>
								<label>
									Silber:
									<input type="checkbox" bind:checked={includeSilver} />
								</label>
								<label>
									Bronze:
									<input type="checkbox" bind:checked={includeBronze} />
								</label>
							</div>
							<div class="flex w-48 flex-col gap-2 px-4">
								<label class="flex items-center justify-between">
									Mindest Rating?
									<input type="checkbox" bind:checked={_isMinRating} />
								</label>

								<input
									type="number"
									min="1"
									max="99"
									bind:value={minRating}
									class="rounded bg-[#61c3f0] p-2 text-white outline-none disabled:opacity-50"
									placeholder="z.B. 75"
									disabled={!_isMinRating}
								/>
							</div>
						</div>
					{/if}
					{#if selectedTemplate == 2}
						<div class="flex flex-col gap-2 border-t-2 pt-4">
							<span>Deine Batch, deine Wahl: Männer, Frauen oder alle?</span>

							<div class="flex items-center justify-evenly">
								<label>
									Männer
									<input type="checkbox" bind:checked={includeMen} />
								</label>
								<label>
									Frauen
									<input type="checkbox" bind:checked={includeWomen} />
								</label>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{:else if selectedTemplate == 4}
			<div class="flex h-full w-full items-center justify-evenly">
				<div class="flex items-center gap-2">
					<span>Wähle ein Rating:</span>
					<input
						type="number"
						min="40"
						max="99"
						bind:value={selectedRating}
						class="w-24 rounded bg-[#61c3f0] p-2 text-[#2F393E] outline-none"
						on:blur={() => {
							if (selectedRating < 40) {
								selectedRating = 40;
							} else if (selectedRating > 99) {
								selectedRating = 99;
							}
						}}
					/>
				</div>

				<div class="flex h-full flex-col justify-center gap-8 border-l-2 pt-4 pl-8">
					<label class="flex items-center justify-between gap-2 border-b px-2 pt-4 pb-4">
						<span>Möchtest du Base-Karten einbeziehen?</span>
						<input type="checkbox" bind:checked={withBaseCards} />
					</label>
					<div class="flex flex-col gap-2">
						<span>Deine Batch, deine Wahl: Männer, Frauen oder alle?</span>

						<div class="flex items-center justify-evenly">
							<label>
								Männer
								<input type="checkbox" bind:checked={includeMen} />
							</label>
							<label>
								Frauen
								<input type="checkbox" bind:checked={includeWomen} />
							</label>
						</div>
					</div>
				</div>
			</div>
		{:else if selectedTemplate == 5}
			<div class="flex h-full w-full items-center justify-center">
				<div class="text-center pr-10">
					<span>Diese Option sammelt nur die beste Karte je Spieler.</span>
				</div>
				<div class="flex h-full grow flex-col gap-2 border-l pl-10 text-white">
					<label class="flex items-center gap-2 divide-x-2 pt-4">
						<span class="pr-2">Möchtest du Base-Karten einbeziehen?</span>
						<input type="checkbox" bind:checked={withBaseCards} />
					</label>
					{#if withBaseCards}
						<div class="flex gap-8 divide-x-2" transition:slide>
							<div
								class="flex flex-col gap-1 py-2 pr-8 text-sm *:flex *:w-20 *:items-center *:justify-between *:gap-1"
							>
								<label>
									Gold:
									<input type="checkbox" bind:checked={includeGold} />
								</label>
								<label>
									Silber:
									<input type="checkbox" bind:checked={includeSilver} />
								</label>
								<label>
									Bronze:
									<input type="checkbox" bind:checked={includeBronze} />
								</label>
							</div>
							<div class="flex w-48 flex-col gap-2 px-4">
								<label class="flex items-center justify-between">
									Mindest Rating?
									<input type="checkbox" bind:checked={_isMinRating} />
								</label>

								<input
									type="number"
									min="1"
									max="99"
									bind:value={minRating}
									class="rounded bg-[#61c3f0] p-2 text-white outline-none disabled:opacity-50"
									placeholder="z.B. 75"
									disabled={!_isMinRating}
								/>
							</div>
						</div>
					{/if}

					<div class="flex flex-col gap-2 border-t-2 pt-4">
						<span>Deine Batch, deine Wahl: Männer, Frauen oder alle?</span>

						<div class="flex items-center justify-evenly">
							<label>
								Männer
								<input type="checkbox" bind:checked={includeMen} />
							</label>
							<label>
								Frauen
								<input type="checkbox" bind:checked={includeWomen} />
							</label>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
