<script>
	export let name,
		size = '1rem';

	const icons = {
		x: {
			boxX: 448,
			boxY: 512,
			svg: '<path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32"/>'
		},
		share:{
			boxX: 24,
			boxY: 24,
			svg:'<path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"/>'
			
		},
		refresh:{
			boxX: 24,
			boxY: 24,
			svg:'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path stroke-miterlimit="10" d="M18.024 7.043A8.374 8.374 0 0 0 3.74 12.955"/><path stroke-linejoin="round" d="m17.35 2.75l.832 3.372a1.123 1.123 0 0 1-.854 1.382l-3.372.843"/><path stroke-miterlimit="10" d="M5.976 16.957a8.374 8.374 0 0 0 14.285-5.912"/><path stroke-linejoin="round" d="m6.65 21.25l-.832-3.372a1.124 1.124 0 0 1 .855-1.382l3.371-.843"/></g>'
		}
	};

	let displayIcon = icons[name];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`0 0 ${displayIcon.boxX} ${displayIcon.boxY}`}
	width={size}
	height={size}
	class={$$props.class}
>
	{@html displayIcon.svg}
</svg>
