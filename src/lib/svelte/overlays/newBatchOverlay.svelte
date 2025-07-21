<script>
	import { onMount, onDestroy } from 'svelte';
	import { afterUpdate } from 'svelte';
	import ProgressBar from './partials/progressBar.svelte';
	import { browser } from '$app/environment';
	import { allCardsStore } from '$lib/stores/cards';
	import { managerDataStore, versionAssetsStore } from '$lib/stores/dataStores';
	import SearchInput from '../partials/searchInput.svelte';
	import { customBatchesStore } from '$lib/stores/batches';

	import TemplateSelector from './newBatchOverlayComponents/TemplateSelectionStep.svelte';
	import CustomizeTemplateStep from './newBatchOverlayComponents/customizeTemplateStep.svelte';
	import PlayerOverviewStep from './newBatchOverlayComponents/playerOverviewStep.svelte';
	import FinishTheBatchStep from './newBatchOverlayComponents/finishTheBatchStep.svelte';
	import Icon from '../components/icon.svelte';

	import { filterPlayersFromTemplate } from '$lib/utils/playerFilterFromtemplate.js';

	import { insertBatch } from '$lib/utils/addCustomBatchesHelper.js';

	export let _isOverlayOpen = false;

	let wasOpenedViaHistory = false;

	function resetOverlay() {
		currentStep = 1;
		selectedTemplate = null;

		selectedPlayers = [];
		selectedNations = [];
		selectedClubs = [];
		selectedLeagues = [];

		searchQuery = '';
		withBaseCards = false;

		includeGold = true;
		includeSilver = true;
		includeBronze = true;

		_isMinRating = false;
		minRating = 40;

		includeMen = true;
		includeWomen = true;

		selectedRating = 90;

		batchName = '';
	}

	function onPopState() {
		if (wasOpenedViaHistory) {
			_isOverlayOpen = false;
			wasOpenedViaHistory = false;
			resetOverlay();
		}
	}

	onMount(() => {
		resetOverlay();
		if (browser) {
			window.addEventListener('popstate', onPopState);

			checkVisibility();
			window.addEventListener('scroll', checkVisibility);
			window.addEventListener('resize', checkVisibility);

			return () => {
				window.removeEventListener('scroll', checkVisibility);
				window.removeEventListener('resize', checkVisibility);
			};
		}
	});

	let visibleCards = new Set();
	let allCards = [];

	function checkVisibility() {
		visibleCards = new Set();

		allCards.forEach((el, i) => {
			if (!el) return;
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				visibleCards.add(i);
			}
		});
	}

	afterUpdate(() => {
		checkVisibility();
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('popstate', onPopState);
		}
	});

	$: if (_isOverlayOpen) {
		history.pushState({ overlay: true }, '');
		wasOpenedViaHistory = true;
	}

	let currentStep = 1;
	let steps = ['Vorlage wählen', 'Vorlage anpassen', 'Spieler hinzufügen', 'Fertigstellen'];

	let selectedTemplate = null;
	let selectedPlayers = [];
	let searchQuery = '';
	let withBaseCards = false;

	let selectedClubs = [];
	let selectedNations = [];
	let selectedLeagues = [];

	let includeGold = true;
	let includeSilver = true;
	let includeBronze = true;

	let _isMinRating = false;
	let minRating = 40;

	let includeMen = true;
	let includeWomen = true;

	let selectedRating = 90;

	let batchName = '';

	let additionalPlayers = [];
	let excludedPlayerIds = new Set();

	function isPlayerFromWomenClub(player) {
		const club = $managerDataStore?.clubs?.find((c) => c.id === player.clubId);
		return club?.isWomen === true;
	}

	$: playersFromTemplate = filterPlayersFromTemplate({
		allCards: $allCardsStore,
		templateId: selectedTemplate,
		clubs: selectedClubs,
		nations: selectedNations,
		leagues: selectedLeagues,
		rating: selectedRating,
		withBaseCards,
		includeGold,
		includeSilver,
		includeBronze,
		isMinRating: _isMinRating,
		minRating,
		includeMen,
		includeWomen,
		managerData: $managerDataStore?.clubs ?? []
	});

	$: finalPlayers = selectedTemplate !== 4 ? selectedPlayers : playersFromTemplate;

	$: filtered = Array.from(new Map($allCardsStore.map((card) => [card.resourceId, card])).values())
		.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
		.sort((a, b) => b.rating - a.rating);

	function handlePlayerClick(selectedItem, type) {
		if (type === 'club') {
			if (selectedClubs.includes(selectedItem.id)) {
				return;
			}
			selectedClubs = [...selectedClubs, selectedItem.id];
		} else if (type === 'nation') {
			if (selectedNations.includes(selectedItem.id)) {
				return;
			}
			selectedNations = [...selectedNations, selectedItem.id];
		} else if (type === 'league') {
			if (selectedLeagues.includes(selectedItem.id)) {
				return;
			}
			selectedLeagues = [...selectedLeagues, selectedItem.id];
		}
	}

	$: isStepValid = (() => {
		if (currentStep === 1) return selectedTemplate !== null;

		if (currentStep === 2) {
			if (selectedTemplate === 1) return selectedClubs.length > 0;
			if (selectedTemplate === 2) return selectedNations.length > 0;
			if (selectedTemplate === 3) return selectedLeagues.length > 0;
			if (selectedTemplate === 4) return selectedRating !== null;
			if (selectedTemplate === 5) return true; // kein Pflichtfeld für 5
			return false;
		}

		if (currentStep === 3) {
			if (selectedTemplate === 0) {
				return selectedPlayers.length > 0;
			} else {
				return playersFromTemplate.length > 0 || additionalPlayers.length > 0;
			}
		}

		return true;
	})();
</script>

{#if _isOverlayOpen === true}
	<div
		class="pointer-events-auto absolute top-0 left-0 z-100 flex size-full h-screen w-screen items-center justify-center bg-gray-900/90"
	>
		<div
			class="relative flex h-2/3 w-2/3 flex-col gap-2 overflow-hidden rounded-xl bg-[#2F393E] shadow-lg"
		>
			<div
				class="flex h-20 w-full items-center justify-between gap-2 bg-[#61c3f0] p-2 pl-10 text-lg font-black text-[#2F393E]"
			>
				Stelle deine eigene Batch oder dein Wunsch-Team zusammen, welches du sammeln und teilen
				möchtest.
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					on:click={() => {
						_isOverlayOpen = false;
						resetOverlay();
						if (wasOpenedViaHistory) {
							history.back();
						}
					}}
					class="flex size-14 min-w-14 cursor-pointer items-center justify-center rounded-full border-6 p-2 font-black text-[#2F393E] shadow-2xl transition-all duration-300 hover:border-[#2F393E] hover:bg-[#2F393E] hover:text-[#61c3f0]"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="-rotate-45"
						><path
							fill="currentColor"
							d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32"
						/></svg
					></button
				>
			</div>
			<div class="flex w-full flex-grow flex-col p-4 px-10 text-[#61c3f0]">
				{#if currentStep >= 1 && currentStep <= 4}
					<p class="m-2 text-white">
						{[
							'Entscheide, ob du eine Vorlage nutzen willst.',
							'Passe die Vorlage für dich an!',
							'Entscheide, welche Spieler in deiner Batch landen sollen.',
							'Bitte überprüfe deine Auswahl und benenne deine Batch. Du kannst sie später jederzeit anpassen.'
						][currentStep - 1]}
					</p>

					{#if currentStep === 1}
						<TemplateSelector
							{selectedTemplate}
							onChange={(id) => (selectedTemplate = id)}
							bind:_isOverlayOpen
						/>
					{:else if currentStep === 2}
						<CustomizeTemplateStep
							bind:selectedTemplate
							bind:selectedClubs
							bind:selectedNations
							bind:selectedLeagues
							bind:selectedRating
							bind:withBaseCards
							bind:includeGold
							bind:includeSilver
							bind:includeBronze
							bind:_isMinRating
							bind:minRating
							bind:includeMen
							bind:includeWomen
							onClubAdd={(club) => handlePlayerClick(club, 'club')}
							onNationAdd={(nation) => handlePlayerClick(nation, 'nation')}
							onLeagueAdd={(league) => handlePlayerClick(league, 'league')}
							onClubRemove={(id) => (selectedClubs = selectedClubs.filter((c) => c !== id))}
							onNationRemove={(id) => (selectedNations = selectedNations.filter((n) => n !== id))}
							onLeagueRemove={(id) => (selectedLeagues = selectedLeagues.filter((l) => l !== id))}
						/>
					{:else if currentStep === 3}
						<PlayerOverviewStep
							bind:selectedPlayers
							bind:additionalPlayers
							bind:excludedPlayerIds
							{playersFromTemplate}
							{selectedTemplate}
						/>
					{:else if currentStep === 4}
						<FinishTheBatchStep {finalPlayers} bind:batchName />
					{/if}
				{/if}
			</div>

			<div class="px-10">
				<ProgressBar {steps} bind:currentStep />
			</div>
			<div
				class="flex justify-end gap-2 p-2 font-bold *:w-32 *:cursor-pointer *:rounded *:border-2 *:px-1 *:py-2 *:text-[#61c3f0] *:transition-all *:duration-300 *:disabled:cursor-not-allowed *:disabled:text-white *:disabled:opacity-50 *:[&:not(:disabled):hover]:border-[#2F393E] *:[&:not(:disabled):hover]:bg-[#61c3f0] *:[&:not(:disabled):hover]:text-[#61c3f0]"
			>
				<button
					on:click={() => {
						_isOverlayOpen = false;
						resetOverlay();
					}}>Abbrechen</button
				>
				<button
					on:click={() => {
						if (currentStep === 3 && selectedTemplate === 0) {
							currentStep = 1;
						} else if (currentStep === 4 && selectedTemplate === 4) {
							currentStep = 2;
						} else {
							currentStep--;
						}
					}}
					disabled={currentStep === 1}>Zurück</button
				>
				<button
					on:click={() => {
						if (currentStep === 1 && selectedTemplate === 0) {
							currentStep = 3;
						} else if (currentStep === 2 && selectedTemplate === 4) {
							currentStep = 4;
						} else {
							currentStep++;
						}
					}}
					disabled={currentStep === steps.length || !isStepValid}>Weiter</button
				>
				<button
					on:click={() => {
						_isOverlayOpen = false;
						insertBatch({
							// ✅ hier geändert
							name: batchName,
							allIds: finalPlayers.map((p) => p.resourceId),
							templateId: selectedTemplate,
							additionalIds: additionalPlayers.map((p) => p.resourceId),
							excludedIds: Array.from(excludedPlayerIds),
							filter: {
								clubs: selectedClubs,
								nations: selectedNations,
								leagues: selectedLeagues,
								rating: selectedRating,
								withBaseCards,
								includeMen,
								includeWomen,
								includeGold,
								includeSilver,
								includeBronze,
								isMinRating: _isMinRating,
								minRating
							}
						});
						resetOverlay();
					}}
					disabled={currentStep !== steps.length || batchName.trim() === ''}>Fertig</button
				>
			</div>
		</div>
	</div>
{/if}
