<script lang="ts">
	import { LinkedChart, LinkedLabel } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';
	import { getCharts, getWorker } from './utils/context';
	import * as fflate from 'fflate';
	const charts = getCharts();

	export let name: string;
	export let choices: string;
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

		window.fflate = fflate;

		data = await dataFetch(`${name}.json.gz`)
			.then((res) => {
				const obj: {
					[key: string]: number;
				} = {};

				res.v.forEach((element) => {
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
					obj[key] = Number(((obj[key] / res.v.length) * 100).toFixed(2));
				});

				queueMicrotask(() => {
					charts.update((prev) => {
						return {
							...prev,
							[name]: obj
						};
					});
				});

				return obj;
			})
			.catch(() => {
				error = true;
			})
			.finally(() => {
				resolved = true;
			});
	});
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
