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

    // 3. Hole cards.json von GitHub
    const cardsResponse = await fetch('https://raw.githubusercontent.com/Flo-Kayser/FUTCARDS/refs/heads/main/cards.json');
    if (!cardsResponse.ok) {
        throw new Error('Network response was not ok (cards.json)');
    }
    const cards = await cardsResponse.json();

    // 4. Hole alle Seiten der Badges-Collection
    let page = 1;
    let badges = [];
    let hasNext = true;

    while (hasNext) {
        const badgesResponse = await fetch(`https://www.fut.gg/api/fut/collections/25/?page=${page}`);
        if (!badgesResponse.ok) {
            throw new Error(`Failed to fetch badges on page ${page}`);
        }

        const badgesPage = await badgesResponse.json();
        badges = badges.concat(badgesPage.data);

        if (badgesPage.next === null) {
            hasNext = false;
        } else {
            page++;
        }
    }

    // 5. Gib alles gemeinsam zurück
    return { coreData, additionalCoreData, cards, badges };
}
