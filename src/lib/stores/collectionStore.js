import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEYS = {
	collected: 'collectedCards',
	impossible: 'impossibleCards',
	totsColor: 'totsColor'
};

function createPersistentStore(key) {
	const initial = browser ? JSON.parse(localStorage.getItem(key) || '{}') : {};

	const store = writable(initial);

	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const collectedCardsStore = createPersistentStore(STORAGE_KEYS.collected);
export const impossibleCardsStore = createPersistentStore(STORAGE_KEYS.impossible);
export const totsColorStore = createPersistentStore(STORAGE_KEYS.totsColor);
