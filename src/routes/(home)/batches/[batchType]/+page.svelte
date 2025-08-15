<script>
	import { goto } from '$app/navigation';
	import { onDestroy, onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';

	import { allOfficialBatchesStore, customBatchesStore } from '$lib/stores/batches';
	import { allCardsStore } from '$lib/stores/cards';
	import { versionAssetsStore, managerDataStore } from '$lib/stores/dataStores';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore';
	import { settingsStore } from '$lib/stores/settings';

	import RenderedCard from '$lib/svelte/components/renderedCard.svelte';
	import NewBatchOverlay from '$lib/svelte/overlays/newBatchOverlay.svelte';
	import Icon from '$lib/svelte/components/icon.svelte';

	import {
		ensureAllCardsStore,
		ensureBatchesStore,
		ensurePlayStylePathsStore,
		ensureVersionAssetsStore
	} from '$lib/utils/initStores';

	import { encodeBatchToClipboardWithId } from '$lib/utils/customBatchCodeGenHelper';
	import { updateBatch } from '$lib/utils/updateBatch.js';

	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';

	export let data;

	let copiedBatchId = null;
	let _isOverlayOpen = false;
	let searchTerm = '';
	let batchElements = [];
	let visibleBatches = new Set();

	$: cardsReady =
		($allCardsStore.length > 0 &&
			$allOfficialBatchesStore.length > 0 &&
			$versionAssetsStore.length > 0) ||
		$customBatchesStore;

	$: if (browser) {
		document.body.style.overflow = _isOverlayOpen ? 'hidden' : '';
	}

	onDestroy(() => {
		if (browser) document.body.style.overflow = '';
	});

	onMount(async () => {
		await ensureBatchesStore();
		await ensureAllCardsStore();
		await ensureVersionAssetsStore();
		await ensurePlayStylePathsStore();

		if (browser) {
			checkVisibility();
			window.addEventListener('scroll', checkVisibility);
			window.addEventListener('resize', checkVisibility);

			return () => {
				window.removeEventListener('scroll', checkVisibility);
				window.removeEventListener('resize', checkVisibility);
			};
		}
	});

	afterUpdate(() => {
		checkVisibility();
	});

	function checkVisibility() {
		visibleBatches = new Set();
		batchElements.forEach((el, i) => {
			if (!el) return;
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				visibleBatches.add(i);
			}
		});
	}

	function findCardVersion(cardId) {
		const card = $allCardsStore.find((c) => c.resourceId === cardId);
		return $versionAssetsStore.find((v) => v.eaId === card?.versionId);
	}

	function countCollectedOrImpossible(resourceIds) {
		let count = 0;

		for (const resourceId of resourceIds) {
			const card = $allCardsStore.find((c) => c.resourceId === resourceId);
			if (!card) continue;

			const versionId = card.versionId;
			const collected = $collectedCardsStore[versionId]?.includes(resourceId);
			const impossible = $impossibleCardsStore[versionId]?.includes(resourceId);

			if (collected || impossible) count++;
		}

		return count;
	}

	function toggleFavoriteBatches(batchId) {
		settingsStore.update((current) => {
			const currentFavorites = current.favoriteOfficialBatches ?? [];
			const isFav = currentFavorites.includes(batchId);

			return {
				...current,
				favoriteOfficialBatches: isFav
					? currentFavorites.filter((id) => id !== batchId)
					: [...currentFavorites, batchId]
			};
		});
	}

	$: filteredBatches =
		data?.batchType === 'officialBatches' && $allOfficialBatchesStore
			? $allOfficialBatchesStore
					.filter((batch) => batch.name?.toLowerCase().includes(searchTerm.toLowerCase()))
					.sort((a, b) => {
						const favs = $settingsStore.favoriteOfficialBatches ?? [];
						const aFav = favs.includes(a.id);
						const bFav = favs.includes(b.id);
						if (aFav && bFav) return favs.indexOf(b.id) - favs.indexOf(a.id);
						if (aFav) return -1;
						if (bFav) return 1;
						return b.id - a.id;
					})
			: data?.batchType === 'myBatches' && $customBatchesStore?.length > 0
				? $customBatchesStore
						.filter((batch) => batch.name?.toLowerCase().includes(searchTerm.toLowerCase()))
						.sort((a, b) => b.id - a.id)
				: [];
</script>

<NewBatchOverlay bind:_isOverlayOpen />
{#if filteredBatches?.length !== 0 || customBatchesStore}
	<div class="relative grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
		{#if data?.batchType === 'myBatches'}
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button
				on:click={() => (_isOverlayOpen = !_isOverlayOpen)}
				class="absolute top-4 left-4 flex size-12 cursor-pointer items-center justify-center rounded-md border-4 p-2 font-black text-white shadow-2xl backdrop-brightness-70 transition-all duration-300 hover:border-white hover:bg-white hover:text-stone-500"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
					><path
						fill="currentColor"
						d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32"
					/></svg
				>
			</button>
		{/if}

		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Nach Batch / Eventteam suchen..."
			class="col-start-1 w-full rounded-lg px-4 py-2 text-lg font-bold text-white outline-none lg:col-start-2"
			style={`background-image: url('https://ucarecdn.com/5f772506-991c-4043-9d69-a1510e6ca152/img_batches.png'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`}
		/>

		{#if cardsReady === true}
			{#each filteredBatches as batch, index}
				<div class="group/batch relative" bind:this={batchElements[index]}>
					<button
						on:click={() => goto(`/batches/${data?.batchType}/${batch.slug}/page=1`)}
						class="relative flex h-full min-h-40 w-full cursor-pointer flex-col items-center rounded-lg border-2 border-transparent p-4 pt-8 text-2xl font-black transition-all duration-300 hover:border-white md:pt-4 lg:text-3xl {index %
							2 ===
						1
							? ' text-[#e23070] lg:text-[#14004a]'
							: 'text-[#e23070]'}"
						style={`background-image: url('https://ucarecdn.com/5f772506-991c-4043-9d69-a1510e6ca152/img_batches.png'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`}
					>
						<div class="mb-4">{batch?.name}</div>
						{#if visibleBatches.has(index)}
							<div class="flex flex-wrap justify-center gap-2 text-base lg:hidden">
								{#each batch.highlightedIds.slice(0, 4) as cardId}
									<RenderedCard
										card={$allCardsStore.find((c) => c.resourceId === cardId)}
										cardVersion={findCardVersion(cardId)}
										_isImpossible={false}
										_isNotCollected={false}
										_ignoredScale={true}
									/>
								{/each}
							</div>
							<div class="hidden flex-wrap justify-center gap-2 text-base lg:flex">
								{#each batch.highlightedIds as cardId}
									<RenderedCard
										card={$allCardsStore.find((c) => c.resourceId === cardId)}
										cardVersion={findCardVersion(cardId)}
										_isImpossible={false}
										_isNotCollected={false}
										_ignoredScale={true}
									/>
								{/each}
							</div>
						{/if}
						<div class="absolute top-2 right-2 text-lg">
							{countCollectedOrImpossible(batch.allIds)} / {batch.allIds.length}
						</div>
					</button>
					{#if data?.batchType === 'officialBatches'}
						<button
							on:click={() => toggleFavoriteBatches(batch.id)}
							class="absolute top-2 left-3 cursor-pointer text-3xl text-[#e23070]"
						>
							{#if $settingsStore.favoriteOfficialBatches.includes(batch.id)}
								<span> ★ </span>
							{:else}
								<span class="group-hover/batch:opacity-100 lg:opacity-0">☆</span>
							{/if}
						</button>
					{/if}
					{#if data?.batchType === 'myBatches'}
						<button
							class="absolute top-2 left-3 cursor-pointer text-3xl text-[#e23070]"
							on:click={() => updateBatch(batch)}
							title="Batch aktualisieren"
						>
							<Icon name="refresh" size="2rem" />
						</button>
						<button
							class="absolute bottom-2 left-3 rotate-45 cursor-pointer text-3xl text-[#e23070]"
							on:click={() => {
								if (confirm('Möchtest du diesen Batch wirklich löschen?')) {
									customBatchesStore.update((batches) => batches.filter((b) => b.id !== batch.id));
								}
							}}
							title="Batch löschen"
						>
							<Icon name="x" size="2rem" />
						</button>
						<button
							on:click={() => {
								encodeBatchToClipboardWithId(batch, (id) => {
									copiedBatchId = id;
									setTimeout(() => (copiedBatchId = null), 2000);
								});
							}}
							class="absolute right-3 bottom-2 cursor-pointer text-3xl {index % 2 === 1
								? ' text-[#e23070] lg:text-[#14004a]'
								: 'text-[#e23070]'}"
							title="Batch-Code kopieren"
						>
							<span><Icon name="share" size="2rem" /></span>
						</button>
						{#if copiedBatchId === batch.id}
							<div
								transition:fade
								class="absolute right-2 bottom-12 rounded bg-white px-2 py-1 text-sm font-bold text-[#2F393E] shadow"
							>
								Kopiert!
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		{/if}

		{#if $customBatchesStore.length === 0 && data?.batchType === 'myBatches'}
			<div
				class="col-span-2 flex flex-col gap-4 rounded-lg p-10 font-bold text-white"
				style={`background-image: url('https://ucarecdn.com/5f772506-991c-4043-9d69-a1510e6ca152/img_batches.png'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`}
			>
				<span>Keine eigenen Batches gefunden.</span>
				<span>
					Klicke auf das Plus-Symbol, um deine erste eigene Batch zu erstellen – egal ob dein
					Lieblingsverein, ein Team aus einer Liga oder kreative Spaß-Ideen wie z. B. nur
					glatzköpfige Spieler oder alle mit dem Namen „Müller“.
				</span>
				<span>
					Deiner Fantasie sind keine Grenzen gesetzt! Sobald du eine Batch erstellt hast, findest du
					sie hier zum Sammeln und Verwalten – und kannst sie natürlich auch gern auf unserem
					Discord teilen und gemeinsam mit anderen Spaß beim Sammeln haben.
				</span>
				<span>
					Achte bei Namen und Inhalten bitte auf Fairness und Respekt. Batches mit anstößigem,
					diskriminierendem oder unangemessenem Inhalt haben hier keinen Platz – bei Verstößen kann
					dein Account gesperrt werden.
				</span>
			</div>
		{/if}
	</div>
{/if}
