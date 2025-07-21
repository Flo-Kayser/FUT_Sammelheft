// src/lib/utils/playerFilterFromTemplate.js
export function filterPlayersFromTemplate({
	allCards,
	templateId,
	clubs = [],
	nations = [],
	leagues = [],
	rating = 90,
	withBaseCards = false,
	includeGold = true,
	includeSilver = true,
	includeBronze = true,
	isMinRating = false,
	minRating = 40,
	includeMen = true,
	includeWomen = true,
	managerData = []
}) {
	const isFromWomenClub = (player) => {
		const club = managerData?.find((c) => c.id === player.clubId);
		return club?.isWomen === true;
	};

	let result = [];

	if (templateId === 5) {
		// Beste Karte pro Spieler (assetId)
		const bestCardMap = new Map();

		for (const player of allCards) {
			const key = player.assetId;
			const existing = bestCardMap.get(key);

			if (
				!existing ||
				player.rating > existing.rating ||
				(player.rating === existing.rating && player.versionId > existing.versionId)
			) {
				bestCardMap.set(key, player);
			}
		}

		result = Array.from(bestCardMap.values()).filter((player) => {
			const isBaseCard = player.versionId <= 1;
			const isWomen = isFromWomenClub(player);

			if (!includeMen && !isWomen) return false;
			if (!includeWomen && isWomen) return false;

			if (!withBaseCards && isBaseCard) return false;

			if (withBaseCards && isBaseCard) {
				if (
					(!includeGold && player.rating >= 75) ||
					(!includeSilver && player.rating >= 69 && player.rating < 75) ||
					(!includeBronze && player.rating < 69)
				) {
					return false;
				}
			}

			if (isMinRating && player.rating < minRating) return false;

			return true;
		});
	} else {
		result = allCards.filter((player) => {
			const isBaseCard = player.versionId <= 1;
			const isWomen = isFromWomenClub(player);

			if (templateId === 1 && !clubs.includes(player.clubId)) return false;
			if (templateId === 2 && !nations.includes(player.countryId)) return false;
			if (templateId === 3 && !leagues.includes(player.leagueId)) return false;

			if (templateId === 4) {
				if (player.rating !== rating) return false;
				if (!withBaseCards && isBaseCard) return false;
			}

			if (!includeMen && !isWomen) return false;
			if (!includeWomen && isWomen) return false;

			if (!withBaseCards && isBaseCard) return false;

			if (withBaseCards && isBaseCard) {
				if (
					(!includeGold && player.rating >= 75) ||
					(!includeSilver && player.rating >= 69 && player.rating < 75) ||
					(!includeBronze && player.rating < 69)
				) {
					return false;
				}
			}

			if (isMinRating && player.rating < minRating) return false;

			return true;
		});
	}

	return Array.from(new Map(result.map((p) => [p.resourceId, p])).values()).sort(
		(a, b) => b.rating - a.rating
	);
}
