<script lang="ts">
	import { getContext } from 'svelte';
	import Rect from './Rect.svelte';

	const { data }: any = getContext('LayerCake');

	console.log('ran bar');
</script>

<g class="bar-group">
	{#each $data as d, i}
		<Rect data={d} index={i} />
	{/each}
</g>
