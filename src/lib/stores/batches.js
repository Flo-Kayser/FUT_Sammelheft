import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const allOfficialBatchesStore = writable([]);

export const customBatchesStore = writable(getCustomBatchesFromLocalstorage());

customBatchesStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem("customBatches", JSON.stringify(value));
	}
});

function getCustomBatchesFromLocalstorage() {
	if (browser) {
		try {
			const storedData = localStorage.getItem('customBatches');
			return storedData ? JSON.parse(storedData) : [];
		} catch (err) {
			console.error('Fehler beim Laden der Custom Batches:', err);
		}
	}
	return { customBatches: [] };
}
