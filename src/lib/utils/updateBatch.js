// src/lib/utils/updateBatch.js
import { get } from 'svelte/store';
import { allCardsStore } from '$lib/stores/cards';
import { managerDataStore } from '$lib/stores/dataStores';
import { filterPlayersFromTemplate } from '$lib/utils/playerFilterFromTemplate';

export function updateBatch(batch) {
	const allCards = get(allCardsStore);
	const managerData = get(managerDataStore)?.clubs ?? [];

	if (!batch.templateId || batch.templateId === 0) return batch;

	const players = filterPlayersFromTemplate({
		allCards,
		templateId: batch.templateId,
		...batch.filter,
		managerData
	});

	const excludedSet = new Set(batch.excludedIds || []);
	const additionalSet = new Set(batch.additionalIds || []);

	const fromTemplateIds = players
		.map((p) => p.resourceId)
		.filter((id) => !excludedSet.has(id));

	const allIds = [...new Set([...fromTemplateIds, ...Array.from(additionalSet)])];
	const allPlayerObjs = allCards.filter((p) => allIds.includes(p.resourceId));

	const highlightedIds = allPlayerObjs
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 8)
		.map((p) => p.resourceId);

	return {
		...batch,
		allIds,
		highlightedIds,
		updatedAt: Date.now()
	};
}
