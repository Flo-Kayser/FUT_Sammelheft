import { browser } from "$app/environment";

export async function load({ params }) {
	const { page } = params;

	const currentPage = page.split('=')[1];

	return {
		currentPage,	
	};
}
