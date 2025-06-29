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

export function resolveClub(card, core, additionalCoreData) {
	if (!card?.clubId) return null;

	let club = core?.clubs?.find((c) => c.eaId === card.clubId);
	if (club) return club;

	const addClubs = additionalCoreData?.clubs;
	if (!addClubs) return null;

	const clubInAdd = addClubs?.find((c) => c.id === card.clubId);
	if (!clubInAdd) return null;

	if (clubInAdd.isWomen) {
		const matchStrategies = [
			(c) => clubInAdd.name?.includes(c.name) && c.id !== clubInAdd.id,
			(c) =>
				(c.name?.includes(clubInAdd.name) || clubInAdd.name?.includes(c.name)) &&
				c.id !== clubInAdd.id,
			(c) => clubInAdd.abbrName === c.abbrName && c.id !== clubInAdd.id,
		];

		for (const strategy of matchStrategies) {
			const match = addClubs.find(strategy);
			if (match) {
				club = core?.clubs?.find(
					(c) => c.eaId === match.id || match.name?.includes(c.name)
				);
				if (club) return club;
			}
		}
	} 
	console.warn('Club not found for card:', card);
	return null;
}