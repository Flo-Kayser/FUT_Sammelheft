import fs from 'fs/promises';
import { cardsFilter } from './stores/cards';

export async function getVersionIdForSquad(squadSlug, coreData) {
	const rarity = coreData.data.rarities.find(
		(r) => r.slug.toLowerCase() === squadSlug.toLowerCase()
	);
	if (!rarity) {
		throw new Error(`No rarity found for squad "${squadSlug}"`);
	}
	return rarity.eaId;
}



export function resetCardsFilter(){
	cardsFilter.update((f) => ({ ...f, leagueId: '', clubId: '' }));
}