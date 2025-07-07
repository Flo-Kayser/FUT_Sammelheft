<script>
	import { settingsStore } from '$lib/stores/settings';
	import { resolveClub } from '$lib/Utils.js';
	export let card, cardVersion, squadName, core, additionalCoreData, _isImpossible, _isCollected;
	let club;

	let scale;

	settingsStore.subscribe((value) => (scale = value?.cardScale || 1));

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
	$: club = resolveClub(card, core, additionalCoreData);
</script>

<div class="relative overflow-hidden" style="width: {320 * scale}px; height: {400 * scale}px;">
	<div
		class={`absolute top-0 left-0 origin-top-left `}
		style="transform: scale({scale}); width: 320px; height: 400px;"
	>
		<div
			class={`absolute h-full w-full ${_isImpossible ? 'brightness-50 grayscale-200' : ''} ${_isCollected ? 'opacity-80 grayscale-100' : ''}`}
		>
			<img
				src={`${cardVersion.eaId > 3 ? `https://cdn.easysbc.io/fc25/cards/e_${cardVersion.eaId}_0.png` : `https://cdn.easysbc.io/fc25/cards/e_${cardVersion.eaId}_3.png`}`}
				alt={squadName}
				class="pointer-events-none absolute -top-8"
			/>
			<img
				src={card?.playerUrl}
				alt={card?.cardName}
				class={`pointer-events-none absolute ${card?.hasDynamicImage ? '-top-7 w-full' : 'top-1/7 right-8 w-3/5'}`}
			/>
			<div class="absolute top-[20%] left-[21%] -translate-x-1/2 scale-125 text-center">
				<div class="scale-y-[1.2] text-[1.73em] font-[800]">{card?.rating}</div>
				<div class="mt-0.5 scale-y-[1.2] text-[0.83em] font-bold">{card?.preferredPosition}</div>
			</div>
			<div class="absolute top-[63%] right-1/2 w-full translate-x-1/2">
				<div class="mb-1 text-2xl font-black whitespace-nowrap">{card?.cardName}</div>
				<div class="absolute left-1/2 flex w-[68%] -translate-x-1/2 justify-between">
					{#each card?.attributes as attribute, i}
						<div class="flex flex-col items-center">
							<span class="scale-y-[1.2] text-[0.58em] font-semibold">{labels[i]}</span>
							<span class="mt-1 scale-y-[1.3] text-sm font-bold">{attribute}</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="absolute top-[83%] flex w-full scale-125 items-center justify-center gap-2">
				{console.log(club)}
				<img src={`https://cdn.easysbc.io/fc25/countries/${nation.eaId}.png`} alt={nation?.slug} class="h-[0.9525em] w-[1.65em]" />
				<img src={`https://cdn.easysbc.io/fc25/leagues/dark/${league.eaId}.png`} alt={league?.slug} class="ratio-square h-[1.375em]" />
				{#if !(club?.eaId === 114605 || club?.eaId === 112658)}
					<img src={`https://cdn.easysbc.io/fc25/clubs/dark/${club.eaId}.png`} alt={club?.slug} class="ratio-square h-[1.375em]" />
				{/if}
			</div>
		</div>

		{#if _isImpossible}
			<div
				style={`color: #${cardVersion?.textColor[0]}; background-color: #${cardVersion?.lineColor[0]}`}
				class="absolute top-[20%] left-0 w-2/3 -rotate-45 rounded-lg py-2 text-center text-xl font-bold"
			>
				Impossible
			</div>
		{/if}
	</div>
</div>
