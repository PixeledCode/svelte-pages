<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from './Chart.svelte';
	import { getCharts, getWorker, setChartContext } from './utils/context';
	import column_types from './data/column_types.json';
	import { dataFetch } from './utils/fetcher';

	setChartContext();
	const workerContext = getWorker();
	let worker: Worker;

	const charts = getCharts();
	let loadChart: boolean = false;
	let filterList: {
		[key: string]: number | string;
	} = {};
	let filteredData: number[][];

	let data: any;

	onMount(async () => {
		// worker = new Worker(new URL('./utils/worker.ts', import.meta.url));
		// worker.addEventListener('message', ({ data }) => {
		// 	console.log(data);
		// });
		// workerContext.worker = worker;

		data = await dataFetch(`intentions_filter_columns.json`);
		data.c.forEach((el: string) => (filterList[el] = NaN));
		filteredData = data.v;
	});

	const list = [
		'assistance_received_during_journey',
		'experience_difficulty_receiving_support_during_journey',
		'experience_discrimination_y_n',
		'personal_local_bank_account_in_admin0_y_n'
	];
	const columns: any = column_types;

	function handleFilter(e: any, type: string) {
		let filtered = [...data.v];

		if (e.target.value === 'all') {
			filterList[type] = NaN;
		} else {
			filterList[type] = Number(e.target.value);
		}

		Object.keys(filterList).forEach((key) => {
			if (!Number.isNaN(filterList[key])) {
				const idx = data.c.findIndex((el: string) => el === key);
				const value = filterList[key];
				filtered = filtered.filter((el: number[]) => {
					return el[idx] === value;
				});
			}
		});

		filteredData = filtered;
	}
</script>

<main class="flex flex-col min-h-screen justify-center items-center">
	<h1 class="text-2xl">IOM Charts</h1>

	<div class="flex gap-4 flex-wrap mt-4">
		<label class="flex flex-col">
			Gender
			<select
				name="gender"
				class="border rounded-sm p-1"
				on:change={(e) => handleFilter(e, 'gender')}
			>
				<option value="all">All</option>
				<option value={0}>Female</option>
				<option value={1}>Male</option>
			</select>
		</label>

		<label class="flex flex-col">
			Age Group
			<select
				name="age_group"
				class="border rounded-sm p-1"
				on:change={(e) => handleFilter(e, 'age_group')}
			>
				<option value="all">All</option>
				<option value={0}>18-29</option>
				<option value={1}>30-39</option>
				<option value={2}>40-49</option>
				<option value={3}>50-59</option>
				<option value={4}>60+</option>
			</select>
		</label>
	</div>

	<p class="mt-4">Filtered Data: {filteredData ? filteredData.length : 'loading...'}</p>

	<div class="grid grid-cols-2 grid-rows-2 justify-center gap-2 mt-4">
		{#each list as item}
			<Chart name={item} choices={columns[item].choices} />
		{/each}

		<!-- next chart will fail to fetch data -->
		<!-- <Chart name="5" /> -->

		<!-- checking if context is working -->
		<!-- {#if !loadChart}
			<div class="w-[300px] h-[300px] flex items-center justify-center border rounded-md">
				<button
					class="w-full h-full hover:bg-gray-100"
					on:click={() => {
						loadChart = true;
					}}>click to load chart 4 from context</button
				>
			</div>
		{:else}
			<Chart name="4" />
		{/if} -->
	</div>
</main>
