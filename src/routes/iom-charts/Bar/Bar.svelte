<!--
  @component
  Generates an SVG bar chart.
 -->
<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');

	/** @type {String} [fill='#00bbff'] - The shape's fill color. */
	export let fill = '#0D369A';
</script>

<g class="bar-group">
	{#each $data as d, i}
		<rect
			class="group-rect"
			data-id={i}
			x={$xScale.range()[0]}
			y={$yGet(d) + 12}
			height={24}
			width={$xGet(d)}
			rx={4}
			{fill}
		></rect>
		<text
			x={$xScale.range()[0] + $xGet(d) / 1.15}
			y={$yGet(d) + 26}
			dominant-baseline="middle"
			text-anchor="middle"
			fill="white"
			class="text"
		>
			{$data[i].value}%
		</text>
	{/each}
</g>

<style>
	.text {
		font-size: 12px;
		font-weight: 500;
	}
</style>
