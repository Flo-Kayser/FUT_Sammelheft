<script>
	export let steps, currentStep;
</script>

<div
	class="grid w-full divide-x-2 overflow-hidden rounded  text-sm text-[#14004a]"
	style="grid-template-columns: repeat({steps?.length || 1}, minmax(0, 1fr));"
>
	{#each steps as step, index}
		<div
			class={`${index < currentStep ? 'bg-[#61c3f0] text-[#2F393E]' : 'bg-white brightness-75'} flex items-center justify-center font-bold py-1 text-lg`}
		>{step}</div>
	{/each}
</div>
