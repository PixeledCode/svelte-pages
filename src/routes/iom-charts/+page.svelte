<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Chart from './Chart.svelte';
	import column_types from './data/column_types.json';
	import { getFilters, setChartContext } from './utils/context';
	import { dataFetch, globalFilter } from './utils/fetcher';
	import { setParams } from './utils/params';
	import { listOfCharts, filterOptions } from './data/constants';

	setChartContext(); // initiate context for charts on page level
	const columns: any = column_types; // this is to handle typescript error
	let worker: Worker;

	const filters = getFilters();
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

		// does not work without setTimeout

		setTimeout(() => {
			// this will sync the url params with the $page store
			const initialFilters = setParams({});

			// set the initial filter list with index number or NaN
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

	function handleFilter(e: any, type: string) {
		const { value } = e.target;
		const idx = value === 'all' ? NaN : columns[type].choices.indexOf(value);

		// update the filter list
		filters.set({ ...$filters, [type]: idx });
		// set query params of the selected filter
		setParams({ [type]: value });
	}
</script>

<main class="flex flex-col min-h-screen justify-center items-center">
	<h1 class="text-2xl">IOM Charts</h1>

	<div class="flex gap-4 flex-wrap mt-4">
		{#each filterOptions as filter}
			<label class="flex flex-col">
				Gender
				<select
					name={filter.name}
					class="border rounded-sm p-1"
					on:change={(e) => handleFilter(e, filter.name)}
					value={$page.state[filter.name] || filter.options[0].value}
				>
					{#each filter.options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
		{/each}
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
