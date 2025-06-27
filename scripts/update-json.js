import axios from 'axios';
import fs from 'fs/promises';

// --- API endpoints ---
const BASE_URL = 'https://api.easysbc.io';
const CARDS_ENDPOINT = (page) => `/players?page=${page}`;

async function fetchAndStoreData() {
	try {
		const allCards = [];

		for (let page = 1; page <= 20; page++) {
			console.log(`<< Fetching player cards from page ${page}... >>`);
			const response = await axios.get(BASE_URL + CARDS_ENDPOINT(page));
			const cards = response.data?.players ?? [];
			console.log(`Fetched ${cards.length} cards from page ${page}.`);

			allCards.push(...cards);
		}

		await fs.writeFile('static/cards.json', JSON.stringify(allCards, null, 2));
		console.log('Saved cards.json');
	} catch (error) {
		console.error('Error during fetch or file write:', error.message);
	}
}

fetchAndStoreData();
