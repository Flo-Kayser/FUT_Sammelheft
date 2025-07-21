// src/lib/utils/addCustomBatchesHelper.js
import { customBatchesStore } from '$lib/stores/batches';

export function insertBatch({
	name,
	allIds,
	templateId = null,
	filter = {},
	additionalIds = [],
	excludedIds = []
}) {
	const slug = name.toLowerCase().replace(/\s+/g, '-');
	const highlightedIds = allIds.slice(0, 8);

	const newBatch = {
		id: Date.now(),
		name,
		slug,
		allIds,
		highlightedIds,
		templateId,
		filter,
		additionalIds,
		excludedIds
	};

	customBatchesStore.update((batches) => [...batches, newBatch]);
}
