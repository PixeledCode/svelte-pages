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
			y={$yGet(d)}
			height={$yScale.bandwidth()}
			width={$xGet(d)}
			rx={1}
			{fill}
		></rect>
		<text
			x={$xScale.range()[0] + $xGet(d) / 1.15}
			y={$yGet(d) + $yScale.bandwidth() / 2}
			dominant-baseline="middle"
			text-anchor="middle"
			fill="white"
			style={'font-size: 12px; font-weight: medium'}
		>
			{$data[i].value}%
		</text>
	{/each}
</g>
