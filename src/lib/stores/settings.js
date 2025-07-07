import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'settingsStore';

function getInitialSettings() {
	if (browser) {
		try {
			const storedData = localStorage.getItem(STORAGE_KEY);
			const parsed = storedData ? JSON.parse(storedData) : {};
			return {
				cardsPerPage: parsed.cardsPerPage ?? 20,
				cardScale: parsed.cardScale ?? 0.75,

				showCollectedCards: parsed.showCollectedCards ?? true,
				showUncollectedCards: parsed.showUncollectedCards ?? true,
				showImpossibleCards: parsed.showImpossibleCards ?? true,
			};
		} catch (err) {
			console.error('Fehler beim Laden der Einstellungen:', err);
		}
	}
	return {
		cardsPerPage: 20,
		cardScale: 0.75,
		showCollectedCards: true,
		showUncollectedCards: true,
		showImpossibleCards: true,
	};
}

export const settingsStore = writable(getInitialSettings());

settingsStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	}
});
