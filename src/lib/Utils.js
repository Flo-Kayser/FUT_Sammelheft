import { cardsFilter } from './stores/cards';

export function resetCardsFilter() {
	cardsFilter.update((f) => ({ ...f, leagueId: '', clubId: '' }));
}
