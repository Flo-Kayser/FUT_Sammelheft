export async function load({ params }) {
	return {
		batchSlug: params.batchSlug,
		batchType: params.batchType 
	};
}
