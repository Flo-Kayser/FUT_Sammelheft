import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEYS = {
	collected: 'collectedCards',
	impossible: 'impossibleCards'
};

function createPersistentStore(key) {
	const initial = browser
		? JSON.parse(localStorage.getItem(key) || '{}')
		: {};

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

export function toggleCard(store, versionId, resourceId) {
	let result;
	store.update((map) => {
		const currentSet = new Set(map[versionId] ?? []);
		if (currentSet.has(resourceId)) {
			currentSet.delete(resourceId);
			result = true;
		} else {
			currentSet.add(resourceId);
			result = false;
		}
		return {
			...map,
			[versionId]: [...currentSet]
		};
	});
	return result;
}
