<script lang="ts">
	import { LinkedChart, LinkedLabel } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';
	import { getCharts, getWorker } from './utils/context';
	const charts = getCharts();

	export let name: string;
	export let choices: string;
	export let filteredData: number[];

	let data: {
		[key: string]: number;
	} | void;
	let error: boolean = false;
	let resolved: boolean = false;

	$: filteredData && run();

	function run() {
		if ($charts[name]) {
			const filtered = filteredData.map((el) => $charts[name].raw.v[el]);
			data = generateData({ v: filtered });
		}
	}

	onMount(async () => {
		const cached = $charts[name];
		if (cached) {
			queueMicrotask(() => {
				data = cached.data;
				resolved = true;
				return;
			});
		}

		data = await dataFetch(`${name}.json`)
			.then((res) => {
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
				return generateData(res as { v: number[] });
			})
			.catch(() => {
				error = true;
			})
			.finally(() => {
				resolved = true;
			});
	});

	function generateData(currentData: { v: number[] }) {
		const obj: {
			[key: string]: number;
		} = {};

		currentData.v.forEach((element) => {
			if (typeof element === 'number') {
				const key = choices[element];
				if (obj[key]) {
					obj[key]++;
				} else {
					obj[key] = 1;
				}
			}
		});

		Object.keys(obj).forEach((key) => {
			obj[key] = Number(((obj[key] / currentData.v.length) * 100).toFixed(2));
		});

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

		return obj;
	}
</script>

<div class="w-[300px] h-[300px] flex flex-col items-center justify-center border rounded-md">
	{#if !resolved}
		<p>Loading...</p>
	{:else if error}
		<p>Error fetching data</p>
	{:else if data}
		<p class="text-center my-2 px-2">{name.replaceAll('_', ' ')}</p>
		<LinkedLabel linked={name} />
		<LinkedChart
			grow
			barMinWidth={0}
			linked={name}
			valueAppend="%"
			{data}
			width={240}
			height={240}
			showValue
		/>
	{/if}
</div>
