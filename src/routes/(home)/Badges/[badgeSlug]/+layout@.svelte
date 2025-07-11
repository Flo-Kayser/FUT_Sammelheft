<script>
	import { goto } from '$app/navigation';

	export let children;
	export let data;

	import bgUrl from '$lib/assets/bg-images/bg-badges.png';
</script>

<div
	style={`background-image: url(${bgUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;`}
>
	<div class="relative h-screen overflow-hidden pt-4 backdrop-brightness-60 backdrop-grayscale-25">
		<button
			onclick={() => {
				goto('/Badges');
			}}
			class="absolute top-3 left-3 cursor-pointer rounded-md px-2 py-1 font-bold text-stone-300 shadow-xl transition duration-300 hover:brightness-80 active:scale-95"
			>Badge Übersicht</button
		>
		<h1 class="text-center text-5xl font-black text-[#e23070]">{data?.badgeSlug?.toUpperCase()}</h1>

		{@render children()}
	</div>
</div>
