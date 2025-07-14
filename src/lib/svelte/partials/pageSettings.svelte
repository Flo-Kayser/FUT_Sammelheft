<script>
	import { goto } from '$app/navigation';
	import { settingsStore } from '$lib/stores/settings';
	import { impossibleSwitchStore } from '$lib/stores/smallStores';

	export let cardVersion;

	let cardScaleSlider;
	let labelLeft = '0px';
	let _isSettingsOpen = false;

	$: if (cardScaleSlider) {
		const labelWidth = 40,
			sliderWidth = 212;
		const percent =
			($settingsStore.cardScale - cardScaleSlider.min) /
			(cardScaleSlider.max - cardScaleSlider.min);
		labelLeft = `${percent * (sliderWidth - labelWidth) - 10}px`;
	}

	$: textColor = '#' + (cardVersion?.eaId > 3 ? cardVersion?.large?.colors?.topText : cardVersion?.large?.[3]?.colors?.topText);

</script>

<div
	class={`absolute right-1 bottom-1 z-20 flex flex-col items-end rounded-lg border-2  text-amber-500 shadow-lg select-none ${
		_isSettingsOpen ? 'bg-stone-900 ' : 'h-13 bg-transparent'
	}`}
	style={`color: ${_isSettingsOpen ? `` : `${textColor}`}`}
>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button on:click={() => (_isSettingsOpen = !_isSettingsOpen)} class="cursor-pointer px-4 py-2">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M2.131 13.63a10 10 0 0 1 .001-3.26c1.101.026 2.092-.502 2.477-1.431c.385-.93.058-2.003-.74-2.763a10 10 0 0 1 2.306-2.307c.76.798 1.834 1.125 2.763.74c.93-.385 1.458-1.376 1.431-2.477a10 10 0 0 1 3.261 0c-.026 1.102.502 2.092 1.431 2.477c.93.385 2.003.058 2.763-.74a10 10 0 0 1 2.307 2.306c-.798.76-1.125 1.834-.74 2.764s1.376 1.458 2.477 1.43a10 10 0 0 1 0 3.262c-1.102-.027-2.092.501-2.477 1.43c-.385.93-.058 2.004.74 2.764a10 10 0 0 1-2.306 2.306c-.76-.798-1.834-1.125-2.764-.74s-1.458 1.376-1.43 2.478a10 10 0 0 1-3.262-.001c.027-1.101-.502-2.092-1.43-2.477c-.93-.385-2.004-.058-2.764.74a10 10 0 0 1-2.306-2.306c.798-.76 1.125-1.834.74-2.763c-.385-.93-1.376-1.458-2.478-1.431M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
			/>
		</svg>
	</button>

	<section class={`${_isSettingsOpen ? 'block ' : 'hidden '}  font-bold`}>
		<div class="mx-auto mt-10 flex w-full max-w-md flex-col gap-2 px-4 py-2">
			<div class="relative flex w-full">
				<div>Karten Größe:</div>
				<div class="relative ml-2 flex-1">
					<div
						class="absolute -top-8 z-0 w-10 rounded bg-amber-500 px-2 py-1 text-center text-xs text-stone-900 shadow transition-all duration-200"
						style={`left: ${labelLeft};`}
					>
						<span class="absolute -z-10 size-6 rotate-45 bg-amber-500"></span>
						{$settingsStore.cardScale.toFixed(2)}
					</div>
					<input
						bind:this={cardScaleSlider}
						type="range"
						min="0.01"
						max="2.00"
						step="0.01"
						bind:value={$settingsStore.cardScale}
						class="h-2 w-48 appearance-none rounded-lg bg-gray-300 outline-none"
					/>
				</div>
				<div>
					<input
						type="number"
						min="0.01"
						max="2"
						step="0.01"
						bind:value={$settingsStore.cardScale}
						class="ml-2 w-16 rounded border border-gray-300 p-1 text-center text-sm"
						on:input={(e) => {
							if (e.target.value > 2) e.target.value = 2;
							if (e.target.value < 0) e.target.value = 0.01;
							$settingsStore.cardScale = parseFloat(e.target.value);
						}}
					/>
				</div>
			</div>
			<div class="flex w-full items-center justify-between">
				<div>Karten Anzahl pro Seite:</div>

				<div>
					<input
						type="number"
						min="1"
						max="100"
						bind:value={$settingsStore.cardsPerPage}
						class="ml-2 w-16 rounded border border-gray-300 p-1 text-center text-sm"
					/>
				</div>
			</div>

			<div class="mt-1 border-t-2 border-white py-2 text-sm">
				<label class="inline-flex cursor-pointer items-center gap-2">
					<span>Karten sammeln</span>
					<input
						type="checkbox"
						value=""
						class="peer sr-only"
						bind:checked={$impossibleSwitchStore}
					/>
					<div
						class="peer relative h-6 w-11 rounded-full bg-amber-500 peer-checked:bg-amber-500 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
					></div>

					<span>Unmögliche Karten markieren</span>
				</label>
			</div>

			{#each [
				{ label: 'Gesammelte Karten anzeigen:', key: 'showCollectedCards' },
				{ label: 'Noch Fehlende Karten anzeigen:', key: 'showUncollectedCards' },
				{ label: 'Unmögliche Karten anzeigen:', key: 'showImpossibleCards' }
			] as item}
				<label class="flex w-full items-center justify-between text-white gap-2">
					<div>{item.label}</div>
					<input
						type="checkbox"
						bind:checked={$settingsStore[item.key]}
						class="peer sr-only"
						on:input={() => goto('./page=1')}
					/>
					<div class="peer relative h-5 w-5 rounded-sm bg-white peer-checked:bg-amber-500">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
							class="absolute top-0.5 left-0.5 text-white">
							<g fill="none" fill-rule="evenodd">
								<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
								<path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0" stroke-width="2" stroke="currentColor"/>
							</g>
						</svg>
					</div>
				</label>
			{/each}
		</div>
	</section>
</div>
