<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

	import Button from './Button.svelte';

	export let items = [
		{
			image: '/image-1.jpeg',
			alt: 'Before de-weeding, Yelahanka Puttenahalli.'
		},
		{
			image: '/image-2.jpeg',
			alt: 'Installation of floating islands.'
		},
		{
			image: '/image-3.jpeg',
			alt: 'After de-weeding, Yelahanka Puttenahalli.'
		},
		{
			image: '/image-4.jpeg',
			alt: 'Floating island and a waterbird, Madiwala.'
		}
	];
	let emblaApi: EmblaCarouselType;

	let options: EmblaOptionsType = {
		loop: true,
		align: 'center',
		containScroll: false,
		skipSnaps: true
	};
	const onInit = (event: { detail: any }) => {
		emblaApi = event.detail;
	};

	function updateSlides(dir: string) {
		if (dir === 'next') {
			emblaApi.scrollNext();
		} else {
			emblaApi.scrollPrev();
		}
	}
</script>

<div
	class="relative h-[380px] w-full max-w-[1440px] mx-auto overflow-hidden mt-10"
	use:emblaCarouselSvelte={{ options, plugins: [WheelGesturesPlugin({})] }}
	on:emblaInit={onInit}
	role="group"
	aria-roledescription="Slider"
	aria-label="Our Process"
>
	<div class="flex">
		{#each items as item}
			<figure
				class="w-full md:w-[520px] min-w-0 flex-grow-0 flex-shrink-0 basis-[80%] md:basis-[520px] mr-4"
			>
				<img
					src={item.image}
					width={520}
					height={340}
					class="w-full md:w-[520px] h-[220px] md:h-[340px] object-cover"
					alt={item.alt}
				/>
				<figcaption class="text-[#4C4C4C] text-sm leading-6 mt-3">
					{item.alt}
				</figcaption>
			</figure>
		{/each}
	</div>
	<Button side="left" {updateSlides} />
	<Button side="right" {updateSlides} />
</div>
