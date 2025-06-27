export async function load({ params }) {
	const { page } = params;

	const currentPage = page.split('=')[1];

	const cardsPerPage = 14;

	return {
		currentPage,
		cardsPerPage
	};
}
