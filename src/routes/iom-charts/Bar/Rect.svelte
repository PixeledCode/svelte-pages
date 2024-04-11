<script lang="ts">
	import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';
	import { getContext } from 'svelte';

	export let data: any;
	export let index: number;
	const { xGet, yGet, xScale, yScale }: any = getContext('LayerCake');

	/** @type {String} [fill='#00bbff'] - The shape's fill color. */
	export let fill: string = '#0D369A';

	const tweenOptions = {
		duration: 300,
		easing: eases.cubicInOut
	};

	const width = tweened(undefined, tweenOptions);

	$: width.set($xGet(data));

	console.log('ran rect');
</script>

<rect
	class="group-rect"
	data-id={index}
	x={$xScale.range()[0]}
	y={$yGet(data)}
	height={$yScale.bandwidth()}
	width={$width}
	rx={1}
	{fill}
></rect>
<text
	x={$xScale.range()[0] + ($width || 0) / 1.15}
	y={$yGet(data) + $yScale.bandwidth() / 2}
	dominant-baseline="middle"
	text-anchor="middle"
	fill="white"
	style={'font-size: 12px; font-weight: medium'}
>
	{data.value}%
</text>
