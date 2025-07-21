import {
	collectedCardsStore,
	impossibleCardsStore,
	totsColorStore
} from '$lib/stores/collectionStore';
import { versionAssetsStore } from '$lib/stores/dataStores';

import { get } from 'svelte/store';

export function toggleCardState(card, state) {
	const { versionId, resourceId, name } = card;
	const collected = get(collectedCardsStore);
	const impossible = get(impossibleCardsStore);

	const stores = {
		collect: {
			target: collectedCardsStore,
			conflict: impossible?.[versionId]?.includes(resourceId),
			conflictMsg: 'ist als "unmöglich" markiert und kann daher nicht gesammelt werden.',
			self: collected?.[versionId]
		},
		impossible: {
			target: impossibleCardsStore,
			conflict: collected?.[versionId]?.includes(resourceId),
			conflictMsg: 'ist bereits gesammelt und kann daher nicht als "unmöglich" markiert werden.',
			self: impossible?.[versionId]
		}
	};

	if ((versionId === 11 && state === 'collect') || (versionId === 120 && state === 'collect')) {
		if (impossible?.[versionId]?.includes(resourceId)) {
			console.warn(`Karte ${name} ist als "unmöglich" markiert und kann nicht gesammelt werden.`);
			return;
		}

		collectedCardsStore.update((store) => {
			store[versionId] = store[versionId] || [];
			if (!store[versionId].includes(resourceId)) {
				store[versionId].push(resourceId);
			}
			return store;
		});

		totsColorStore.update((store) => {
			const current = store[resourceId] ?? 0;

			if (current < 3) {
				store[resourceId] = current + 1;
			} else {
				const confirmed = confirm(`Möchtest du ${name} komplett aus der Sammlung entfernen?`);
				if (!confirmed) return store;

				collectedCardsStore.update((collectedStore) => {
					const list = collectedStore[versionId] || [];
					const index = list.indexOf(resourceId);
					if (index !== -1) list.splice(index, 1);
					if (list.length === 0) delete collectedStore[versionId];
					return collectedStore;
				});

				delete store[resourceId];
			}

			return store;
		});

		return;
	}

	const s = stores[state];
	if (!s) return;

	if (s.conflict) {
		console.warn(`Karte ${name} (ID: ${resourceId}, Version: ${versionId}) ${s.conflictMsg}`);
		return;
	}

	s.target.update((store) => {
		const list = store[versionId] || [];
		const index = list.indexOf(resourceId);

		if (index !== -1) {
			const confirmed = confirm(
				`Möchtest du ${get(versionAssetsStore)?.find((v) => v.eaId === versionId)?.name} ${name} wirklich aus deiner ${state === 'collect' ? 'Sammlung' : '"Unmöglich"-Liste'} entfernen?`
			);
			if (!confirmed) return store;

			list.splice(index, 1);
			if (list.length === 0) delete store[versionId];
		} else {
			if (!store[versionId]) store[versionId] = [];
			store[versionId].push(resourceId);
		}

		return store;
	});
}
