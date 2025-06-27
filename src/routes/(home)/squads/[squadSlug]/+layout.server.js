/** @type {import('./$types').LayoutServerLoad} */

import { getVersionIdForSquad, getCardsForVersion } from '$lib/Utils.js';

export async function load({ params, parent }) {
	const { squadSlug } = params;

	const { coreData } = await parent();

	const versionId = await getVersionIdForSquad(squadSlug, coreData);
	const cards = await getCardsForVersion(versionId);

    

	return { squadSlug, versionId, cards };
}
