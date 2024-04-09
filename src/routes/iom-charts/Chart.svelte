<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { dataFetch, filterChart } from './utils/fetcher';
	import { onMount } from 'svelte';
	import { getCharts } from './utils/context';
	import { LayerCake, Svg } from 'layercake';
	import Bar from './Bar/Bar.svelte';
	import AxisX from './Bar/AxisX.svelte';
	import AxisY from './Bar/AxisY.svelte';

	const xKey = 'value';
	const yKey = 'type';

	const charts = getCharts();

	export let name: string;
	export let choices: string[];
	export let filteredData: number[];
	let worker: Worker;

	type ChartData = { v: number[] };

	let chartData:
		| {
				type: number | string;
				value: number;
		  }[]
		| void;
	let error: boolean = false;
	let resolved: boolean = false;

	// run this function everytime filteredData changes
	$: filteredData && updateChart();

	function updateChart() {
		if ($charts[name]) {
			// mapping filteredData from parent to raw data fetched
			const filtered = filteredData.map((el) => $charts[name].raw.v[el]);
			chartData = generateFilteredChart({ v: filtered });
		}
	}

	onMount(async () => {
		worker = new Worker(new URL('./utils/worker.ts', import.meta.url), { type: 'module' });
		worker.addEventListener('message', ({ data }) => {
			queueMicrotask(() => {
				charts.update((prev: any) => {
					return {
						...prev,
						[name]: {
							...$charts[name],
							// might come handy later. This is filtered but not converted to percentage
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
			//  this will be used later during report generation
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
				return generateFilteredChart(res as ChartData);
			})
			.catch(() => {
				error = true;
			})
			.finally(() => {
				resolved = true;
			});
	});

	function generateFilteredChart(currentData: ChartData) {
		if (!!window.Worker) worker.postMessage({ currentData, choices });
		else {
			const obj = filterChart(currentData, choices);

			queueMicrotask(() => {
				charts.update((prev: any) => {
					return {
						...prev,
						[name]: {
							...$charts[name],
							currentRawData: currentData,
							data: obj
						}
					};
				});
			});

			chartData = obj;
		}
	}
</script>

<div
	class="w-[300px] h-[300px] p-3 flex flex-col items-center justify-center border wrapper chart-wrapper"
>
	{#if !resolved}
		<p>Loading...</p>
	{:else if error}
		<p>Error fetching data</p>
	{:else if chartData}
		<p class="text-center my-2 px-2">{name.replaceAll('_', ' ')}</p>

		<div class="chart-container">
			<LayerCake
				padding={{ bottom: 20, left: 35 }}
				x={xKey}
				y={yKey}
				yScale={scaleBand().paddingInner(0.2)}
				xDomain={[0, null]}
				data={chartData}
			>
				<Svg>
					<AxisX tickMarks baseline snapLabels ticks={3} />
					<AxisY tickMarks gridlines={false} />
					<Bar />
				</Svg>
			</LayerCake>
		</div>
	{/if}
</div>

<style>
	.chart-container {
		width: 100%;
		height: 300px;
	}

	.wrapper {
		box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.25);
		border-radius: 20px;
	}
</style>
