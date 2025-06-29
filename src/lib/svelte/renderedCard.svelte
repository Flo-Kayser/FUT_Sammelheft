<script>
	import { resolveClub } from '$lib/Utils.js';
	export let card, cardVersion, squadName, core, additionalCoreData;
	let club;

	$: isGoalkeeper =
		card?.preferredPosition === 'GK' ||
		card?.preferredPosition === 'TH' ||
		card?.preferredPosition === 'TW';
	const attributeLabels = {
		TW: ['DIV', 'HAN', 'KIC', 'REF', 'SPD', 'POS'],
		notTW: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']
	};
	$: labels = attributeLabels[isGoalkeeper ? 'TW' : 'notTW'];
	$: nation = core?.nations?.find((n) => n.eaId === card?.countryId);
	$: league = core?.leagues?.find((l) => l.eaId === card?.leagueId);

	$: {
		club = resolveClub(card, core, additionalCoreData);
	}

	


</script>

<div>
	<img src={cardVersion?.imageUrl} alt={squadName} class="pointer-events-none" />

	<img
		src={card?.playerUrl}
		alt={card?.cardName}
		class={`pointer-events-none absolute ${card?.hasDynamicImage ? '-top-1 w-64' : 'top-1/5 right-8 w-3/5'}`}
	/>

	<div class="absolute top-[24%] left-[21%] -translate-x-1/2 text-center">
		<div class="scale-y-[1.2] transform text-[1.73em] leading-[0.91em] font-[800]">
			{card?.rating}
		</div>
		<div class="mt-1 scale-y-[1.3] transform text-[0.83em] font-bold">
			{card?.preferredPosition}
		</div>
	</div>

	<div class="absolute top-[64%] right-1/2 w-full translate-x-1/2">
		<div class="text-xl font-black whitespace-nowrap">{card?.cardName}</div>

		<div class="absolute left-1/2 flex w-[68%] -translate-x-1/2 justify-between">
			{#each card?.attributes as attribute, i}
				<div class="flex flex-col items-center justify-center">
					<span class="scale-y-[1.2] transform text-[0.58em] leading-none font-semibold">
						{labels[i]}
					</span>
					<span class="mt-1 scale-y-[1.3] transform text-sm leading-none font-bold">
						{attribute}
					</span>
				</div>
			{/each}
		</div>
	</div>
	<div class=" absolute top-[81%] flex w-full items-center justify-center gap-2">
		<img src={nation?.imageUrl} alt={nation?.slug} class="h-[0.9525em] w-[1.65em]" />
		<img src={league?.imageUrl} alt={league?.slug} class="ratio-square h-[1.375em]" />
		{#if !(club?.eaId === 114605 || club?.eaId === 112658)}
			<img src={club?.imageUrl} alt={club?.slug} class="ratio-square h-[1.375em]" />
		{/if}
	</div>
</div>
