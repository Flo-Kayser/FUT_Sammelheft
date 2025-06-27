import fs from 'fs/promises';

export async function load() {
    // 1. Hole coreData
    const response = await fetch('https://www.fut.gg/api/fut/25/fut-core-data/');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const coreData = await response.json();

    // 2. Hole additionalCoreData
    const additionalResponse = await fetch('https://api.easysbc.io/squad-builder/manager-data');
    if (!additionalResponse.ok) {
        throw new Error('Network response was not ok (additionalCoreData)');
    }
    const additionalCoreData = await additionalResponse.json();

    // 3. Hole cards.json lokal
    const json = await fs.readFile('static/cards.json', 'utf-8');
    const cards = JSON.parse(json);

    // 4. Gib alles gemeinsam zurück
    return { coreData, additionalCoreData, cards };
}
