<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import GlobalMenu from '$lib/svelte/components/globalMenu.svelte';

	export let children;

	const socialLinks = [
		{
			name: 'JulianFGU',
			url: 'https://www.instagram.com/julianfgu/',
			icon: 'instagram',
		},
		{
			name: 'Entwickler',
			url: 'https://www.instagram.com/flo.kysr/',
			icon: 'instagram',
		},
	];

	const otherLinks = [
		{
			url: 'https://www.youtube.com/@JulianFGU',
			icon: 'youtube',
		},
		{
			url: 'https://discord.gg/f65x7YYQVU',
			icon: 'discord',
		},
	];

	function getIcon(name) {
		switch (name) {
			case 'instagram':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4m4.5-3.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2"/></svg>`;
			case 'youtube':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"/></svg>`;
			case 'discord':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"/></svg>`;
		}
		return '';
	}
</script>

<div class="min-h-screen select-none backdrop-blur-xl">
	<!-- Social Icons -->
	<div class="absolute top-3 left-2 z-50 flex gap-2 text-white xl:left-8 xl:top-3 lg:top-20 lg:left-4 ">
		<div class="flex flex-col items-center gap-2 border-r-2 pr-2">
			{#each socialLinks as { name, url, icon }}
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1 rounded-lg px-1 md:border-2"
				>
					<span class="hidden md:block">{name}</span>
					{@html getIcon(icon)}
				</a>
			{/each}
		</div>
		<div class="flex flex-col items-center justify-center gap-2">
			{#each otherLinks as { url, icon }}
				<a href={url} target="_blank" rel="noopener noreferrer">
					{@html getIcon(icon)}
				</a>
			{/each}
		</div>
	</div>

	<!-- Global Menu -->
	<div class="relative w-screen z-30">
		<GlobalMenu />
	</div>

	<!-- Page content -->
	<div class="lg:mt-20 mt-0">
		{@render children()}
	</div>
</div>
