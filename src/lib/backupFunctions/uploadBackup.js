import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/collectionStore';

export function handleUploadBackup(event) {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();

	reader.onload = (e) => {
		try {
			const result = JSON.parse(e.target.result);

			const hasCollectedCards = result.collectedCards && typeof result.collectedCards === 'object';
			const hasImpossibleCards =
				result.impossibleCards && typeof result.impossibleCards === 'object';

			if (!hasCollectedCards || !hasImpossibleCards) {
				alert(
					'Die Datei enthält nicht die erwarteten Datenstrukturen. Bitte überprüfen Sie das Format.'
				);
				return;
			}

			const confirmRestore = confirm(
				'Willst du deine aktuelle Sammlung wirklich mit der hochgeladenen Datei überschreiben?'
			);

			if (!confirmRestore) return;

			collectedCardsStore.set(result.collectedCards);
			impossibleCardsStore.set(result.impossibleCards);

            alert('Die Sammlung wurde erfolgreich aktualisiert.');
		} catch (error) {
			console.error('Fehler beim Parsen der Datei:', error);
			alert('Die Datei konnte nicht verarbeitet werden. Bitte überprüfen Sie das Format.');
			return;
		}
	};
     reader.readAsText(file);
}
