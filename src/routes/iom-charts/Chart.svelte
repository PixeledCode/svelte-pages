<script lang="ts">
	import { LinkedChart } from 'svelte-tiny-linked-charts';
	import { dataFetch } from './utils/fetcher';
	import { onMount } from 'svelte';

	export let name: string;
	let data: {
		[key: string]: number;
	};

	onMount(async () => {
		data = await dataFetch(name);
	});
</script>

<div class="w-[300px] h-[300px] flex items-center justify-center border rounded-md">
	<LinkedChart {data} type="bar" width={240} height={240} />
</div>

<style lang="scss">
</style>
