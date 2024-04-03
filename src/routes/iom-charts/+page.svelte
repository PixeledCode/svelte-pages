<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from './Chart.svelte';
	import { setChartContext } from './utils/context';
	import column_types from './data/column_types.json';
	import { dataFetch, globalFilter } from './utils/fetcher';

	setChartContext();
	let worker: Worker;
	let filterList: {
		[key: string]: number | string;
	} = {};
	let filteredData: number[];

	let data: any;

	onMount(async () => {
		worker = new Worker(new URL('./utils/worker.ts', import.meta.url), { type: 'module' });
		worker.addEventListener('message', ({ data: { filterList } }) => {
			filteredData = filterList;
		});

		data = await dataFetch(`intentions_filter_columns.json`);
		data.c.forEach((el: string) => (filterList[el] = NaN));
	});

	const listOfCharts = [
		'assistance_received_during_journey',
		'experience_difficulty_receiving_support_during_journey',
		'experience_discrimination_y_n',
		'personal_local_bank_account_in_admin0_y_n'
	];
	const columns: any = column_types;

	function handleFilter(e: any, type: string) {
		if (!!window.Worker)
			worker.postMessage({ filterList, value: e.target.value, type, rawData: data });
		else {
			const filteredList = globalFilter(filterList, e.target.value, type, data);
			filteredData = filteredList;
		}
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

	<p class="mt-4">
		Filtered Data: {filteredData?.length || data?.v?.length || 'loading...'}
	</p>

	<div class="grid grid-cols-2 grid-rows-2 justify-center gap-2 mt-4">
		{#each listOfCharts as item}
			<Chart name={item} bind:filteredData choices={columns[item].choices} />
		{/each}
	</div>
</main>
