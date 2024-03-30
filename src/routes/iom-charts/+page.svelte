<script lang="ts">
	import Chart from './Chart.svelte';
</script>

<main class="flex flex-col min-h-screen justify-center items-center">
	<h1 class="text-2xl">IOM Charts</h1>

	<div class="grid grid-cols-2 grid-rows-2 justify-center gap-2 mt-4">
		<Chart name="1" />
		<Chart name="2" />
		<Chart name="3" />
		<Chart name="4" />
	</div>
</main>
