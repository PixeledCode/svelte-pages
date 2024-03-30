<script lang="ts">
	import { LinkedChart } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';
	import { getCharts, getWorker } from './utils/context';
	const charts = getCharts();

	export let name: string;
	let data: {
		[key: string]: number;
	} | void;
	let error: boolean = false;
	let resolved: boolean = false;

	onMount(async () => {
		const cached = $charts[name];
		if (cached) {
			queueMicrotask(() => {
				data = cached;
				resolved = true;
				return;
			});
		}

		data = await dataFetch(name)
			.then((res) => {
				charts.update((obj) => {
					return {
						...obj,
						[name]: res
					};
				});
				return res;
			})
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
