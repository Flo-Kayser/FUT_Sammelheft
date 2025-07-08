<script>
	import { playStylePaths } from './playStylePaths';
	export let lineColor, bgColor, playStyleId;
</script>

<!-- {console.log(playStylePaths[playStyleId])} -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox={playStyleId === 42 ? '0 0 1086 1007' : '0 0 543 508'}
	class={$$props.class}
>
	{#each playStylePaths[playStyleId] ?? [] as path}
		<path d={path.d} style={`fill: ${path.fill === 'line' ? '#' + lineColor : '#' + bgColor}`} />
	{/each}
</svg>
