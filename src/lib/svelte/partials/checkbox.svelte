<script>
	import { settingsStore } from '$lib/stores/settings';
	export let option, label
</script>

<label
	class="flex w-full items-center justify-between gap-4 text-xs font-bold last:mt-4 md:text-base"
>
	<div>{label}</div>
	<input type="checkbox" bind:checked={$settingsStore[option]} class="peer sr-only" />
	<div class="peer relative h-5 min-w-5 rounded-sm bg-white peer-checked:bg-amber-500">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			class="absolute top-0.5 left-0.5 text-white"
		>
			<g fill="none" fill-rule="evenodd">
				<path
					d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
				/>
				<path
					fill="currentColor"
					d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"
					stroke-width="2"
					stroke="currentColor"
				/>
			</g>
		</svg>
	</div>
</label>
