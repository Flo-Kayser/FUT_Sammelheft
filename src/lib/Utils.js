import fs from 'fs/promises';

export async function getVersionIdForSquad(squadSlug, coreData) {
	const rarity = coreData.data.rarities.find(
		(r) => r.slug.toLowerCase() === squadSlug.toLowerCase()
	);
	if (!rarity) {
		throw new Error(`No rarity found for squad "${squadSlug}"`);
	}
	return rarity.eaId;
}

export async function getCardsForVersion(versionId) {
	const cardsRaw = await fs.readFile('static/cards.json', 'utf-8');
	const cards = JSON.parse(cardsRaw);
  return cards
    .filter((card) => card.versionId === versionId)
    .sort((a, b) => b.rating - a.rating);
}
