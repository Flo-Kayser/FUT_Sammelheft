import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore';

export function downloadBackup() {
	let collectedCardsValue;
	let impossibleCardsValue;

	collectedCardsStore.subscribe((value) => {
		collectedCardsValue = value;
	})();

	impossibleCardsStore.subscribe((value) => {
		impossibleCardsValue = value;
	})();

	const date = new Date();

	const formattedDate = date.toISOString().split('T')[0];
	const time = date.toTimeString().split(' ')[0].replace(/:/g, '-');

	const timestamp = `${formattedDate}_${time}`;

	const json = JSON.stringify({
		collectedCards: collectedCardsValue,
		impossibleCards: impossibleCardsValue
	});

	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = `fut-sammelheft_backup_${timestamp}.json`;
	a.click();

	URL.revokeObjectURL(url);
}
