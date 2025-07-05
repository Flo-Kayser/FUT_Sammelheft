import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'collectedCards';

export const collectedCardsStore = writable({});

collectedCardsStore.update(() => {
	if (browser) {
		const storedData = localStorage.getItem(STORAGE_KEY);
		return storedData && Object.keys(storedData).length > 0 ? JSON.parse(storedData) : {};
	}
});

collectedCardsStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	}
});


export function toggleCard(versionId, resourceId) {
	let result;
	let updatedMap;

	collectedCardsStore.update((map) => {
		const currentSet = new Set(map[versionId] ?? []);
		if (currentSet.has(resourceId)) {
			currentSet.delete(resourceId);
			result = true;
		} else {
			currentSet.add(resourceId);
			result = false;
		}

		updatedMap = {
			...map,
			[versionId]: [...currentSet]
		};
		return updatedMap;
	});

	return result;
}
