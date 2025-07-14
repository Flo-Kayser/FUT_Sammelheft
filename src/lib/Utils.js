import fs from 'fs/promises';
import { cardsFilter } from './stores/cards';




export function resetCardsFilter(){
	cardsFilter.update((f) => ({ ...f, leagueId: '', clubId: '' }));
}

