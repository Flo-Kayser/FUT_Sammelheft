import { writable, derived, get } from 'svelte/store';
import { settingsStore } from './settings';
import { collectedCardsStore, impossibleCardsStore } from './collectionStore';

export const allCardsStore = writable([]);

export const cardsFilter = writable({
	versionId: '',
	leagueId: '',
	clubId: ''
});
export const cardsByVersionId = derived(
	[allCardsStore, cardsFilter],
	([$allCardsStore, $cardsFilter]) => {
		if (
			$cardsFilter.versionId === undefined ||
			$cardsFilter.versionId === null ||
			$cardsFilter.versionId === ''
		) {
			return $allCardsStore;
		}

		return $allCardsStore.filter((card) => card.versionId === $cardsFilter.versionId);
	}
);
export const filteredCards = derived(
	[cardsByVersionId, cardsFilter, settingsStore, collectedCardsStore, impossibleCardsStore],
	([$cardsByVersionId, $cardsFilter, $settings, $collectedCards, $impossibleCards]) => {
		const seen = new Set();
		return $cardsByVersionId.filter((card) => {
			if (seen.has(card.resourceId)) return false;
			seen.add(card.resourceId);

			const leagueMatches =
				!$cardsFilter.leagueId || card.leagueId === Number($cardsFilter.leagueId);

			const collectedSet = new Set($collectedCards[card.versionId] || []);
			const impossibleSet = new Set($impossibleCards[card.versionId] || []);

			const isCollected = collectedSet.has(card.resourceId);
			const isImpossible = impossibleSet.has(card.resourceId);

			const showCollected = $settings.showCollectedCards && isCollected;
			const showUncollected = $settings.showUncollectedCards && !isCollected && !isImpossible;
			const showImpossible = $settings.showImpossibleCards && isImpossible;

			const matchesSettings = showCollected || showUncollected || showImpossible;

			return leagueMatches && matchesSettings;
		});
	}
);


export const sortFilteredCardsByRating = derived(
	[filteredCards, cardsFilter],
	([$filteredCards, $cardsFilter]) => {
		return $filteredCards.sort((a, b) => {
			return b.rating - a.rating;
		});
	}
);


