<!--
  @component
  Generates an SVG bar chart.
 -->
<script lang="ts">
	import { getContext } from 'svelte';
	import Rect from './Rect.svelte';

	const { data, xGet, yGet, xScale, yScale }: any = getContext('LayerCake');
</script>

<g class="bar-group">
	{#each $data as d, i}
		<Rect data={d} index={i} {xGet} {yGet} {xScale} {yScale} />
	{/each}
</g>
