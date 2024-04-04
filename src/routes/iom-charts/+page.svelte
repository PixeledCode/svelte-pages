<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Chart from './Chart.svelte';
	import column_types from './data/column_types.json';
	import { getFilters, setChartContext } from './utils/context';
	import { dataFetch, globalFilter } from './utils/fetcher';
	import { setParams } from './utils/params';

	setChartContext(); // initiate context for charts on page level
	const columns: any = column_types; // this is to handle typescript error

	const filters = getFilters();

	let worker: Worker;
	let filterList: {
		[key: string]: number;
	} = {};
	let filteredData: number[];
	let data: any;

	onMount(async () => {
		worker = new Worker(new URL('./utils/worker.ts', import.meta.url), { type: 'module' });
		worker.addEventListener('message', ({ data: { filterList } }) => {
			filteredData = filterList;
		});

		// fetch filter json
		data = await dataFetch(`intentions_filter_columns.json`);
		// initiate filterList with NaN values

		// does not work without setTimeout
		// this will sync the url params with the $page store
		setTimeout(() => {
			const initialFilters = setParams({});
			data.c.forEach((type: string) => {
				let val = initialFilters[type];
				if (val) {
					const idx = val === 'all' ? NaN : columns[type].choices.indexOf(val);
					filterList[type] = idx;
					return;
				}

				filterList[type] = NaN;
			});

			filters.set(filterList);
		}, 1);

		filters.subscribe((value) => {
			if (!!window.Worker) worker.postMessage({ filterList: value, rawData: data });
			else {
				const filteredList = globalFilter(value, data);
				filteredData = filteredList;
			}
		});
	});

	const listOfCharts = [
		'assistance_received_during_journey',
		'experience_difficulty_receiving_support_during_journey',
		'experience_discrimination_y_n',
		'personal_local_bank_account_in_admin0_y_n'
	];

	function handleFilter(e: any, type: string) {
		const value = e.target.value;
		const idx = value === 'all' ? 'all' : columns[type].choices.indexOf(value);

		// set query params of the selected filter
		setParams({ [type]: value });

		filterList = { ...$filters };
		// generate [{filter_name: selected filter}] object
		if (idx === 'all') {
			filterList[type] = NaN;
		} else {
			filterList[type] = idx;
		}

		filters.update(() => filterList);
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
				value={$page.state.gender || 'all'}
			>
				<option value="all">All</option>
				<option value="female">Female</option>
				<option value="male">Male</option>
			</select>
		</label>

		<label class="flex flex-col">
			Age Group
			<select
				name="age_group"
				class="border rounded-sm p-1"
				on:change={(e) => handleFilter(e, 'age_group')}
				value={$page.state.age_group || 'all'}
			>
				<option value="all">All</option>
				<option value="18-29">18-29</option>
				<option value="30-39">30-39</option>
				<option value="40-49">40-49</option>
				<option value="50-59">50-59</option>
				<option value="60+">60+</option>
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
