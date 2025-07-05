<script>
	import { settingsStore } from '$lib/stores/settings';

	export let cardVersion;

	let cardScaleSlider;
	let labelLeft = '0px';
	let _isSettingsOpen = true;

	$: if (cardScaleSlider) {
		const labelWidth = 40,
			sliderWidth = 212;
		const percent =
			($settingsStore.cardScale - cardScaleSlider.min) /
			(cardScaleSlider.max - cardScaleSlider.min);
		labelLeft = `${percent * (sliderWidth - labelWidth) - 10}px`;
	}
</script>

<div
	class={`absolute right-1 bottom-1 flex flex-col items-end rounded-lg border-2 p-2 px-4 text-amber-500 shadow-lg ${
		_isSettingsOpen ? 'bg-stone-900' : 'bg-transparent'
	}`}
	style={`color: ${_isSettingsOpen ? `` : `#${cardVersion.textColor[0]}`}`}
>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button on:click={() => (_isSettingsOpen = !_isSettingsOpen)} class="cursor-pointer">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M2.131 13.63a10 10 0 0 1 .001-3.26c1.101.026 2.092-.502 2.477-1.431c.385-.93.058-2.003-.74-2.763a10 10 0 0 1 2.306-2.307c.76.798 1.834 1.125 2.763.74c.93-.385 1.458-1.376 1.431-2.477a10 10 0 0 1 3.261 0c-.026 1.102.502 2.092 1.431 2.477c.93.385 2.003.058 2.763-.74a10 10 0 0 1 2.307 2.306c-.798.76-1.125 1.834-.74 2.764s1.376 1.458 2.477 1.43a10 10 0 0 1 0 3.262c-1.102-.027-2.092.501-2.477 1.43c-.385.93-.058 2.004.74 2.764a10 10 0 0 1-2.306 2.306c-.76-.798-1.834-1.125-2.764-.74s-1.458 1.376-1.43 2.478a10 10 0 0 1-3.262-.001c.027-1.101-.502-2.092-1.43-2.477c-.93-.385-2.004-.058-2.764.74a10 10 0 0 1-2.306-2.306c.798-.76 1.125-1.834.74-2.763c-.385-.93-1.376-1.458-2.478-1.431M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
			/>
		</svg>
	</button>

	<section class={`${_isSettingsOpen ? 'block ' : 'hidden '}  font-bold`}>
		<div class="mx-auto mt-10 flex w-full max-w-md flex-col gap-2 px-4">
			<div class="relative flex w-full">
				<div>Karten Größe:</div>
				<div class="relative ml-2 flex-1">
					<div
						class="absolute -top-8 z-0 w-14 rounded bg-amber-500 px-2 py-1 text-xs text-stone-900 shadow transition-all duration-200"
						style={`left: ${labelLeft};`}
					>
						<span class="absolute -z-10 size-6 rotate-45 bg-amber-500"></span>
						<input
							type="Number"
							min="0.01"
							max="2.00"
							step="0.01"
							bind:value={$settingsStore.cardScale}
							class="w-12"
						/>
					</div>
					<input
						bind:this={cardScaleSlider}
						type="range"
						min="0.01"
						max="2.00"
						step="0.01"
						bind:value={$settingsStore.cardScale}
						class="h-2 w-full appearance-none rounded-lg bg-gray-300 outline-none"
					/>
				</div>
			</div>
			<div class="flex w-full justify-between">
				<div>Karten Anzahl pro Seite:</div>

				<div>
					<input
						type="number"
						min="1"
						max="100"
						bind:value={$settingsStore.cardsPerPage}
						class="ml-2 w-16 rounded border border-gray-300 p-1 text-center"
					/>
				</div>
			</div>
		</div>
	</section>
</div>
