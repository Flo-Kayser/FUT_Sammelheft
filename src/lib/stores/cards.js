import { writable,derived } from "svelte/store";

export const allCardsStore = writable([]);

export const cardsFilter = writable({
    versionId:'',
    league: '',
    club: ''
})
export const cardsByVersionId = derived(
    [allCardsStore, cardsFilter],
    ([$allCardsStore, $cardsFilter]) => {
        if (!$cardsFilter.versionId) return $allCardsStore;

        return $allCardsStore.filter(card => card.versionId === $cardsFilter.versionId);
    }
);
export const filteredCards = derived(
    [cardsByVersionId, cardsFilter],
    ([$cardsByVersionId, $cardsFilter]) => {
        return $cardsByVersionId.filter(card => {
            const leagueMatches = !$cardsFilter.league || card.leagueId === Number($cardsFilter.league);
            const clubMatches = !$cardsFilter.club || card.clubId === Number($cardsFilter.club);
            return leagueMatches && clubMatches;
        });
    }
);
