<script lang="ts">
	import { LinkedChart } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';

	export let name: string;
	let data: {
		[key: string]: number;
	} | void;
	let error: boolean = false;

	onMount(async () => {
		data = await dataFetch(name)
			.then((res) => res)
			.catch(() => {
				error = true;
			});
	});
</script>

<div class="w-[300px] h-[300px] flex items-center justify-center border rounded-md">
	{#if error && !data}
		<p>Error fetching data</p>
	{:else if data}
		<LinkedChart {data} type="bar" width={240} height={240} />
	{/if}
</div>

<style lang="scss">
</style>
