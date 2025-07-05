import { browser } from "$app/environment";
import { settingsStore } from "$lib/stores/settings";

export async function load({ params }) {
	const { page } = params;

	const currentPage = page.split('=')[1];

	return {
		currentPage,	
	};
}
