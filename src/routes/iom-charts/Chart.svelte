<script lang="ts">
	import { LinkedChart, LinkedLabel } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';
	import { getCharts, getWorker } from './utils/context';
	const charts = getCharts();

	export let name: string;
	export let choices: string[];
	export let filteredData: number[];
	let worker: Worker;

	type ChartData = { v: number[] };

	let chartData: {
		[key: string]: number;
	} | void;
	let error: boolean = false;
	let resolved: boolean = false;

	$: filteredData && updateChart();

	function updateChart() {
		if ($charts[name]) {
			const filtered = filteredData.map((el) => $charts[name].raw.v[el]);
			chartData = generateData({ v: filtered });
		}
	}

	onMount(async () => {
		worker = new Worker(new URL('./utils/worker.ts', import.meta.url));
		worker.addEventListener('message', ({ data }) => {
			queueMicrotask(() => {
				charts.update((prev: any) => {
					return {
						...prev,
						[name]: {
							...$charts[name],
							currentRawData: data.currentData,
							data: data.obj
						}
					};
				});
			});

			chartData = data.obj;
		});

		const cached = $charts[name];
		if (cached) {
			queueMicrotask(() => {
				chartData = cached.data;
				resolved = true;
				return;
			});
		}

		await dataFetch(`${name}.json`)
			.then((res) => {
				// add raw data to store
				queueMicrotask(() => {
					charts.update((prev: any) => {
						return {
							...prev,
							[name]: {
								...$charts[name],
								raw: res
							}
						};
					});
				});
				return generateData(res as ChartData);
			})
			.catch(() => {
				error = true;
			})
			.finally(() => {
				resolved = true;
			});
	});

	function generateData(currentData: ChartData) {
		if (!!window.Worker) worker.postMessage({ currentData, choices });
	}
</script>

<div class="w-[300px] h-[300px] flex flex-col items-center justify-center border rounded-md">
	{#if !resolved}
		<p>Loading...</p>
	{:else if error}
		<p>Error fetching data</p>
	{:else if chartData}
		<p class="text-center my-2 px-2">{name.replaceAll('_', ' ')}</p>
		<LinkedLabel linked={name} />
		<LinkedChart
			grow
			barMinWidth={0}
			linked={name}
			valueAppend="%"
			data={chartData}
			width={240}
			height={240}
			showValue
		/>
	{/if}
</div>
