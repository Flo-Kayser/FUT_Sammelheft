<script>
	import { settingsStore } from '$lib/stores/settings';
	import PlayStyleIcons from '$lib/svelte/partials/playStyleIcons.svelte';

	export let card,
		cardVersion,
		_isImpossible,
		_isNotCollected,
		_ignoredScale = false;

	let club;

	let scale;

	$: textColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.topText : cardVersion?.large?.[3]?.colors?.topText);
	$: lineColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.lines : cardVersion?.large?.[3]?.colors?.lines)
	$: stripColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.strip : cardVersion?.large?.[3]?.colors?.strip);

	if (_ignoredScale === false) {
		settingsStore.subscribe((value) => (scale = value?.cardScale || 1));
	} else {
		scale = 0.5;
	}
	$: isGoalkeeper =
		card?.preferredPosition === 'GK' ||
		card?.preferredPosition === 'TH' ||
		card?.preferredPosition === 'TW';

	const attributeLabels = {
		TW: ['DIV', 'HAN', 'KIC', 'REF', 'SPD', 'POS'],
		notTW: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']
	};

	$: labels = attributeLabels[isGoalkeeper ? 'TW' : 'notTW'];
</script>

{#if card && cardVersion}
	<div class="relative overflow-hidden" style="width: {320 * scale}px; height: {400 * scale}px;">
		<div
			class={`relative top-0 left-0 origin-top-left `}
			style="transform: scale({scale}); width: 320px; height: 400px;"
		>
			<div
				class={`absolute h-full w-full ${_isImpossible ? 'brightness-50 grayscale-200' : ''} ${_isNotCollected ? 'opacity-80 grayscale-100' : ''} `}
				style={`color: ${textColor}`}
			>
				{#if cardVersion}
					<img
						src={`${cardVersion?.eaId > 3 ? `${cardVersion?.large?.url}` : `${cardVersion?.large?.[3]?.url}`}`}
						alt={cardVersion.eaId}
						class="pointer-events-none absolute -top-8"
					/>
					<img
						src={card?.playerUrl}
						alt={card?.cardName}
						class={`pointer-events-none absolute ${card?.hasDynamicImage ? '-top-7 w-full' : 'top-1/7 right-8 w-3/5'}`}
					/>
				{/if}
				<div
					class="absolute top-[20%] left-[21%] -translate-x-1/2 scale-125 text-center"
					style={`color: ${textColor}`}
				>
					<div class="scale-y-[1.2] text-[1.73em] font-[800]">{card?.rating}</div>
					<div class="mt-0 scale-y-[1.2] text-[0.83em] font-bold">{card?.preferredPosition}</div>
				</div>
				<div class="absolute top-[63%] right-1/2 w-full translate-x-1/2">
					<div class="mb-1 text-center text-2xl font-black whitespace-nowrap">{card?.cardName}</div>
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
					<img
						src={`https://cdn.easysbc.io/fc25/countries/${card?.countryId}.png`}
						alt={card?.countryId}
						class="h-[0.9525em] w-[1.65em]"
					/>
					<img
						src={`https://cdn.easysbc.io/fc25/leagues/dark/${card?.leagueId}.png`}
						alt={card?.leagueId}
						class="ratio-square h-[1.375em]"
					/>
					{#if !(card?.clubId === 114605 || card?.clubId === 112658)}
						<img
							src={`https://cdn.easysbc.io/fc25/clubs/dark/${card?.clubId}.png`}
							alt={card?.clubId}
							class="ratio-square h-[1.375em]"
						/>
					{/if}
				</div>
				{#if $settingsStore.showPlayStylePlus}
					<div
						class={`absolute left-[5%] flex flex-col gap-0.5 ${
							card?.playStylesPlus?.length === 1
								? 'top-[52%]'
								: card?.playStylesPlus?.length === 2
									? 'top-[42%]'
									: card?.playStylesPlus?.length === 3
										? 'top-[42%]'
										: card?.playStylesPlus?.length === 4
											? 'top-[40%]'
											: card?.playStylesPlus?.length === 5
												? 'top-[36%]'
												: 'top-[30%]'
						}`}
					>
						{#each card?.playStylesPlus as playStylePlusId}
							<PlayStyleIcons
								playStyleId={playStylePlusId}
								lineColor={textColor}
								bgColor={stripColor}
								class="size-8"
							/>
						{/each}
					</div>
				{/if}

				{#if $settingsStore.showPossiblePositions}
					<div class="absolute top-[24%] right-[3%] flex scale-y-[1.2] flex-col gap-1">
						{#each card?.possiblePositions.filter((pos) => pos !== card?.preferredPosition) as position}
							<div
								style={`color: ${textColor}; background-color: ${stripColor}`}
								class="w-11 rounded-md border-2 text-center text-sm font-semibold"
							>
								{position}
							</div>
						{/each}
					</div>
				{/if}

				{#if $settingsStore.showSkillMoves}
					<div class="absolute top-[56.5%] right-[3%] flex flex-col gap-1">
						<div
							style={`color: ${textColor}; background-color: ${stripColor}`}
							class="w-11 rounded-md border-2 text-center text-sm font-semibold"
						>
							{card?.preferredFoot.split('')[0]}
						</div>
						<div
							style={`color: ${textColor}; background-color: ${stripColor}`}
							class="flex w-11 items-center justify-center rounded-md border-2 text-sm font-semibold"
						>
							<span class="scale-y-[1.2]">{card?.skillMoves}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								class="size-3"
								viewBox="0 0 24 24"
								><path
									fill="currentColor"
									d="m12 16.102l-3.63 2.192q-.16.079-.297.064q-.136-.016-.265-.094q-.13-.08-.196-.226t-.012-.319l.966-4.11l-3.195-2.77q-.135-.11-.178-.263t.019-.293t.165-.23q.104-.087.28-.118l4.216-.368l1.644-3.892q.068-.165.196-.238T12 5.364t.288.073t.195.238l1.644 3.892l4.215.368q.177.03.281.119q.104.088.166.229q.061.14.018.293t-.178.263l-3.195 2.77l.966 4.11q.056.171-.011.318t-.197.226q-.128.08-.265.095q-.136.015-.296-.064z"
								/></svg
							>
							<span class="scale-y-[1.2]">{card?.weakFoot}</span>
						</div>
					</div>
				{/if}
			</div>
			{#if _isImpossible}
				<div
					style={`color: ${textColor}; background-color: ${stripColor}`}
					class="absolute top-[20%] left-0 w-2/3 -rotate-45 rounded-lg py-2 text-center text-xl font-bold"
				>
					Impossible
				</div>
			{/if}
		</div>
	</div>
{/if}
