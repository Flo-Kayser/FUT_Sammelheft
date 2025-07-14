<script>
	import { goto } from '$app/navigation';
	import { cardsFilter } from '$lib/stores/cards';
	import { resetCardsFilter } from '$lib/Utils';
	import { managerDataStore } from '$lib/stores/dataStores';

	import { cardsByVersionId } from '$lib/stores/cards';

	export let _isLeagueFilterOpen;


	$: leagueIds = $cardsByVersionId
		? Array.from(
				new Set($cardsByVersionId.filter((card) => card.leagueId).map((card) => card.leagueId))
			).sort((a, b) => a - b)
		: [];
</script>

<div class="absolute right-20 bottom-1 z-10 flex h-13 w-18 rounded-lg border-2">
	<div class="flex h-full items-center justify-between *:cursor-pointer">
		<button
			aria-label="Toggle dropdown"
			onclick={() => {
				_isLeagueFilterOpen = !_isLeagueFilterOpen;
			}}
			><div class={`${_isLeagueFilterOpen ? '-rotate-90' : ''} transition-transform`}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82"
					/></svg
				>
			</div>
		</button>
		<button class="flex w-10 items-center justify-center" onclick={() => resetCardsFilter()}>
			{#if $cardsFilter?.leagueId}
				<img
					src={`https://cdn.easysbc.io/fc25/leagues/dark/${$cardsFilter?.leagueId}.png`}
					alt=""
					class="h-8 w-8"
				/>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
					><path
						fill="currentColor"
						d="M297.87 24.322c-40.38.374-80.665 13.623-114.077 39.72c73.64-37.01 166.104-24.977 227.547 36.464c61.442 61.44 73.013 153.443 36.002 227.084c57.598-73.738 53.068-180.48-14.77-248.317c-37.098-37.098-85.97-55.4-134.703-54.95zm-27.25 63.123c-37.16.42-74.186 14.305-102.975 41.67c60.11-36.405 139.642-28.35 191.54 23.545c51.897 51.898 59.488 130.976 23.08 191.086c56.502-59.44 56.012-153.534-2.31-211.855C349.883 101.82 310.177 87 270.62 87.446zm-16.61 59.54c-28.304 0-56.606 10.797-78.2 32.392c-43.19 43.19-43.19 113.214 0 156.404c43.188 43.19 113.21 43.19 156.4 0s43.19-113.213 0-156.403c-21.594-21.595-49.897-32.393-78.2-32.393m-132.635 28.4c-56.503 59.44-55.552 153.995 2.77 212.316c58.32 58.323 152.416 58.81 211.855 2.308c-60.112 36.41-139.186 28.822-191.084-23.078s-59.95-131.435-23.54-191.545zM56.297 191.54C-1.3 265.276 3.69 372.48 71.527 440.317c67.838 67.838 174.58 72.366 248.32 14.77c-73.642 37.01-165.647 25.44-227.087-36.002S19.286 265.177 56.297 191.538z"
					/></svg
				>
			{/if}
		</button>
	</div>
	{#if _isLeagueFilterOpen}
		<div
			class="absolute right-0 bottom-[112%] flex h-96 w-max flex-col gap-2 overflow-y-scroll bg-stone-900 p-2 text-amber-500 *:flex *:cursor-pointer *:items-center [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-amber-600 [&::-webkit-scrollbar-track]:bg-stone-600"
		>
			<button
				class="gap-2 py-1 pl-1 font-bold"
				onclick={() => {
					resetCardsFilter();
					_isLeagueFilterOpen = false;

					goto('./page=1');
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
					><path
						fill="currentColor"
						d="M297.87 24.322c-40.38.374-80.665 13.623-114.077 39.72c73.64-37.01 166.104-24.977 227.547 36.464c61.442 61.44 73.013 153.443 36.002 227.084c57.598-73.738 53.068-180.48-14.77-248.317c-37.098-37.098-85.97-55.4-134.703-54.95zm-27.25 63.123c-37.16.42-74.186 14.305-102.975 41.67c60.11-36.405 139.642-28.35 191.54 23.545c51.897 51.898 59.488 130.976 23.08 191.086c56.502-59.44 56.012-153.534-2.31-211.855C349.883 101.82 310.177 87 270.62 87.446zm-16.61 59.54c-28.304 0-56.606 10.797-78.2 32.392c-43.19 43.19-43.19 113.214 0 156.404c43.188 43.19 113.21 43.19 156.4 0s43.19-113.213 0-156.403c-21.594-21.595-49.897-32.393-78.2-32.393m-132.635 28.4c-56.503 59.44-55.552 153.995 2.77 212.316c58.32 58.323 152.416 58.81 211.855 2.308c-60.112 36.41-139.186 28.822-191.084-23.078s-59.95-131.435-23.54-191.545zM56.297 191.54C-1.3 265.276 3.69 372.48 71.527 440.317c67.838 67.838 174.58 72.366 248.32 14.77c-73.642 37.01-165.647 25.44-227.087-36.002S19.286 265.177 56.297 191.538z"
					/></svg
				>
				ALL leagues</button
			>

			{#each leagueIds as singleLeagueId}
				<button
					class="gap-2 border-t-2 pt-2 whitespace-nowrap"
					onclick={() => {
						goto('./page=1');
						if ($cardsFilter.leagueId === singleLeagueId) {
							resetCardsFilter();
							_isLeagueFilterOpen = false;
							return;
						} else {
							cardsFilter.update((f) => ({ ...f, leagueId: singleLeagueId }));
							_isLeagueFilterOpen = false;
						}
					}}
				>
					<img
						src={`https://cdn.easysbc.io/fc25/leagues/dark/${singleLeagueId}.png`}
						alt=""
						class="h-8 w-8"
					/>
					<span>
						{$managerDataStore?.leagues?.find((l) => l.id === singleLeagueId)?.name}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
