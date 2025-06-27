import fs from 'fs/promises';
import { allCardsStore } from '$lib/stores/cards';

export async function load() {
    const json = await fs.readFile('static/cards.json', 'utf-8');
    const cards = JSON.parse(json);
    allCardsStore.set(cards);
    console.log('Cards loaded:', cards.length);

    return {cards}}