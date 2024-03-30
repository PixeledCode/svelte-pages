<script lang="ts">
	import { LinkedChart } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';

	export let name: string;
	let data: {
		[key: string]: number;
	} | void;
	let error: boolean = false;
	let resolved: boolean = false;

	onMount(async () => {
		data = await dataFetch(name)
			.catch(() => {
				error = true;
			})
			.finally(() => {
				resolved = true;
			});
	});
</script>

<div class="w-[300px] h-[300px] flex items-center justify-center border rounded-md">
	{#if !resolved}
		<p>Loading...</p>
	{:else if error}
		<p>Error fetching data</p>
	{:else if data}
		<LinkedChart {data} width={240} height={240} />
	{/if}
</div>

<style lang="scss">
</style>
