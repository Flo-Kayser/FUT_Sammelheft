<script>
	import { tick, createEventDispatcher } from 'svelte';

	export let playTrigger = null;

	let videoElement;
	const dispatch = createEventDispatcher();

	$: if (playTrigger) {
		playVideo();
	}

	async function playVideo() {
		await tick();
		if (!videoElement) return;

		videoElement.style.display = 'block';
		videoElement.volume = 0.2;
		videoElement.playbackRate = 1.2;

		try {
			await videoElement.play();
		} catch (e) {
			console.error('Video konnte nicht abgespielt werden', e);
		}
	}

	function handlePlay() {
		videoElement.style.opacity = '1';
	}

	function handleEnded() {
		if (!videoElement) return;

		videoElement.style.opacity = '0';

		setTimeout(() => {
			if (videoElement) {
				videoElement.style.display = 'none';
			}
			dispatch('done');
		}, 400);
	}
</script>

{#if playTrigger}
	<div
		class="pointer-events-none fixed inset-0 z-[9999] bg-black opacity-70 transition-opacity duration-500"
	></div>
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={videoElement}
		class="fixed -top-20 left-0 z-[10000] h-screen w-screen object-fill opacity-0 transition-opacity duration-500"
		width="640"
		height="360"
		on:play={handlePlay}
		on:ended={handleEnded}
	>
		<source
			src={'https://res.cloudinary.com/dppqw6sbt/video/upload/v1752452760/New_Card_Unlocked_6_fm3g64.webm'}
			type="video/webm"
		/>
	</video>
{/if}
