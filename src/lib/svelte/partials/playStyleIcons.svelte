<script>
	import { playStylePathsStore } from '$lib/stores/dataStores';

	export let lineColor, bgColor, playStyleId;
</script>

{#if Object.values($playStylePathsStore)?.length > 0}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={playStyleId === 42 ? '0 0 1086 1007' : '0 0 543 508'}
		class={$$props.class}
	>
		{#each $playStylePathsStore[playStyleId] as path}
			<path d={path.d} style={`fill: ${path.fill === 'line' ? lineColor : bgColor}`} />
		{/each}
	</svg>
{/if}
