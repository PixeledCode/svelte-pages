<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from './Chart.svelte';
	import { getWorker, setChartContext } from './utils/context';
	setChartContext();
	const workerContext = getWorker();
	let worker: Worker;

	let loadChart: boolean = false;

	onMount(() => {
		worker = new Worker(new URL('./utils/worker.ts', import.meta.url));
		worker.addEventListener('message', ({ data }) => {
			console.log(data);
		});

		workerContext.worker = worker;
	});
</script>

<main class="flex flex-col min-h-screen justify-center items-center">
	<h1 class="text-2xl">IOM Charts</h1>

	<div class="grid grid-cols-2 grid-rows-2 justify-center gap-2 mt-4">
		<Chart name="1" />
		<Chart name="2" />
		<!-- next chart will fail to fetch data -->
		<Chart name="5" />
		<Chart name="4" />

		<!-- checking if context is working -->
		{#if !loadChart}
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
		{/if}
	</div>
</main>
