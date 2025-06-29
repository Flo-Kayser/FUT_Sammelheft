import { writable, derived } from 'svelte/store';

export const allCardsStore = writable([]);

export const cardsFilter = writable({
	versionId: '',
	leagueId: '',
	clubId: ''
});
export const cardsByVersionId = derived(
	[allCardsStore, cardsFilter],
	([$allCardsStore, $cardsFilter]) => {
		if (!$cardsFilter.versionId) return $allCardsStore;

		return $allCardsStore.filter((card) => card.versionId === $cardsFilter.versionId);
	}
);
export const filteredCards = derived(
	[cardsByVersionId, cardsFilter],
	([$cardsByVersionId, $cardsFilter]) => {
		return $cardsByVersionId.filter((card) => {
			const leagueMatches =
				!$cardsFilter.leagueId || card.leagueId === Number($cardsFilter.leagueId);
			const clubMatches = !$cardsFilter.clubId || card.clubId === Number($cardsFilter.clubId);
			return leagueMatches && clubMatches;
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
