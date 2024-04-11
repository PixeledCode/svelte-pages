<script>
	import { getContext } from 'svelte';
	import Rect from './Rect.svelte';

	const { data } = getContext('LayerCake');
</script>

<g class="bar-group">
	{#each $data as d, i}
		<Rect data={d} index={i} />
	{/each}
</g>
