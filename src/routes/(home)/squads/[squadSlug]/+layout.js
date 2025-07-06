/** @type {import('./$types').LayoutServerLoad} */

import { getVersionIdForSquad } from '$lib/Utils.js';

export async function load({ params, parent }) {
	const { squadSlug } = params;

	const { coreData } = await parent();

	const versionId = await getVersionIdForSquad(squadSlug, coreData);

	return { squadSlug, versionId };
}
