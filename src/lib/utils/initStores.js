import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { allCardsStore } from '$lib/stores/cards';
import { versionAssetsStore, playStylePathsStore, managerDataStore } from '$lib/stores/dataStores';
import { allBatches } from '$lib/stores/batches';

async function loadIfEmpty(store, fetchFn, label) {
	if (!browser) return;
	if (Object.values(get(store)).length > 0) return;

	console.warn(`${label} leer, lade Daten...`);
	const data = await fetchFn();
	store.set(data);
}

export function ensureVersionAssetsStore() {
	return loadIfEmpty(
		versionAssetsStore,
		async () => {
			const res = await fetch('https://api.easysbc.io/players/version-assets');
			const raw = await res.json();
			return Object.entries(raw).map(([id, squad]) => ({
				...squad,
				eaId: Number(id)
			}));
		},
		'VersionAssetsStore'
	);
}

export function ensureAllCardsStore() {
	return loadIfEmpty(
		allCardsStore,
		async () => {
			const res = await fetch('https://raw.githubusercontent.com/Flo-Kayser/FUTCARDS/refs/heads/main/cards.json');
			return await res.json();
		},
		'AllCardsStore'
	);
}

export function ensureManagerDataStore() {
	return loadIfEmpty(
		managerDataStore,
		async () => {
			const res = await fetch('https://api.easysbc.io/squad-builder/manager-data');
			return await res.json();
		},
		'ManagerDataStore'
	);
}

export function ensurePlayStylePathsStore() {
	return loadIfEmpty(
		playStylePathsStore,
		async () => {
			const res = await fetch('https://raw.githubusercontent.com/Flo-Kayser/FUTCARDS/refs/heads/main/playstyles.json');
			return await res.json();
		},
		'PlayStylePathsStore'
	);
}

export function ensureBatchesStore() {
	return loadIfEmpty(
		allBatches,
		async () => {
			const res = await fetch('https://raw.githubusercontent.com/Flo-Kayser/FUTCARDS/refs/heads/main/batches.json');
			return await res.json();
		},
		'PlayStylePathsStore'
	);
}
