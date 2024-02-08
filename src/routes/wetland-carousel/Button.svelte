<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { clsx } from 'clsx';

	export let updateSlides: any;
	export let side = 'left';
	let Icon = side === 'left' ? ChevronLeft : ChevronRight;
</script>

<div
	transition:fade={{ duration: 100 }}
	class={clsx(
		'container z-10 absolute top-0 flex items-center',
		side === 'right' && 'right-0 pr-2 md:pr-10 justify-end',
		side === 'left' && 'left-0 pl-2 md:pl-10 justify-start'
	)}
>
	<div class={clsx('bg absolute inset-0', side === 'right' && 'container-right')} />
	<button
		data-slide-side={side}
		class="carousel-btn"
		on:click={() => updateSlides(side === 'left' ? 'prev' : 'next')}
	>
		<Icon size={30} />
		<span class="sr-only">{side === 'left' ? 'Previous' : 'Next'} Slide</span>
	</button>
</div>

<style lang="scss">
	.container {
		height: 340px;
		width: 180px;

		@media (max-width: 768px) {
			height: 220px;
			width: 80px;
		}
	}

	.bg {
		opacity: 0.85;
		background: linear-gradient(90deg, #f5f5f5 0%, rgba(245, 245, 245, 0) 85.57%);
	}

	.container-right {
		transform: rotate(180deg);
	}

	.carousel-btn {
		border: none;
		border-radius: 50%;
		background-color: rgba(55, 55, 55, 0.81);
		color: #9c9c9c;
		fill: #9c9c9c;

		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 10;
		padding: 7px;

		@media (max-width: 768px) {
			transform: scale(0.7);
		}
	}
</style>
