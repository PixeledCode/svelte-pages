<script lang="ts">
	import { onMount } from 'svelte';
	import pdfMake from 'pdfmake/build/pdfmake';
	(<any>pdfMake).fonts = {
		Roboto: {
			normal:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
			bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
			italics:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
			bolditalics:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
		}
	};

	const fonts = {
		'Open Sans': {
			normal: 'OpenSans-Regular.ttf',
			medium: 'OpenSans-Medium.ttf'
		}
	};

	let dd: any = {
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				alignment: 'center'
			},
			subheader: {
				fontSize: 15,
				bold: true
			},
			quote: {
				italics: true
			},
			small: {
				fontSize: 10
			}
		},
		defaultStyle: {
			columnGap: 20,
			fontSize: 12,
			font: 'Roboto'
		}
	};

	function handleOpen() {
		let elms = document.querySelectorAll('.chart-wrapper svg');

		let content = [
			{
				text: 'IOM Charts\n',
				style: 'header'
			},
			{
				text: 'Some subheading.\n\n',
				style: 'subheader'
			},
			{
				alignment: 'justify',
				columns: [
					{
						svg: elms[0].outerHTML,
						fit: [240, 240]
					},
					{
						svg: elms[1].outerHTML,
						fit: [240, 240]
					}
				]
			},
			'\n\n',
			{
				alignment: 'justify',
				columns: [
					{
						svg: elms[2].outerHTML,
						fit: [240, 240]
					},
					{
						svg: elms[3].outerHTML,
						fit: [240, 240]
					}
				]
			}
		];
		dd.content = content;
		pdfMake.createPdf(dd).open();
	}

	onMount(() => {
		// import './utils/vfs_fonts';
	});
</script>

<button
	class="mt-8 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 font-medium text-sm rounded"
	on:click={handleOpen}
>
	Open PDF
</button>
