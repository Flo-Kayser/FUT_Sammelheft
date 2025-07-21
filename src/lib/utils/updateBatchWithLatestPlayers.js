import { filterPlayersFromTemplate } from './playerFilterFromTemplate';

export function updateBatchWithLatestPlayers(batch, allCards, managerData) {
	if (!batch?.filter || batch.templateId === 0) {
		console.warn('No valid filter or templateId. Returning original batch.');
		return batch;
	}

	const updatedPlayers = filterPlayersFromTemplate({
		allCards,
		templateId: batch.templateId,
		clubs: batch.filter.clubs,
		nations: batch.filter.nations,
		leagues: batch.filter.leagues,
		rating: batch.filter.rating,
		withBaseCards: batch.filter.withBaseCards,
		includeGold: batch.filter.includeGold,
		includeSilver: batch.filter.includeSilver,
		includeBronze: batch.filter.includeBronze,
		isMinRating: batch.filter.isMinRating,
		minRating: batch.filter.minRating,
		includeMen: batch.filter.includeMen,
		includeWomen: batch.filter.includeWomen,
		managerData
	});

	const newAllIds = updatedPlayers
		.filter((p) => !batch.excludedIds?.includes(p?.resourceId))
		.map((p) => p?.resourceId)
		.filter((id) => typeof id === 'number' && id > 0); // ✅ FIX

	const newAdditionalIds = (batch.additionalIds || []).filter(
		(id) => !newAllIds.includes(id) && typeof id === 'number' && id > 0
	);

	const allIdsCombined = [...new Set([...newAllIds, ...newAdditionalIds])];

	return {
		...batch,
		allIds: allIdsCombined,
		highlightedIds: allIdsCombined.slice(0, 8),
		updatedAt: Date.now()
	};
}
