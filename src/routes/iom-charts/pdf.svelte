<script lang="ts">
	import { onMount } from 'svelte';
	import pdfMake from 'pdfmake/build/pdfmake';
	import { getParams } from './utils/params';

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

	export let total: string;

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
				fontSize: 12,
				bold: true
			},
			quote: {
				italics: true
			},
			small: {
				fontSize: 10
			},
			chartText: {
				fontSize: 12,
				alignment: 'center'
			},
			svgText: {
				bold: true
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
		const params = getParams();

		let filterString = '';
		let keys = Object.keys(params);
		for (let i = 0; i < keys.length; i++) {
			let symbol = i === keys.length - 2 ? ' & ' : ' , ';
			symbol = i === keys.length - 1 ? '' : symbol;
			filterString += `${keys[i]}: ${Object.values(params)[i]}${symbol}`;
		}

		let content = [
			{
				text: 'IOM Charts\n\n',
				style: 'header'
			},
			{
				text: `Filters: ${filterString.length ? filterString : 'None'}\n\n`,
				style: 'subheader'
			},
			{
				text: `Total Dataset: ${Number(total).toLocaleString()}\n\n`,
				style: 'subheader'
			},
			{
				alignment: 'justify',
				columns: [
					[
						{
							text: 'assistance received during journey\n\n',
							style: 'chartText'
						},

						{
							svg: elms[0].outerHTML,
							fit: [240, 240]
						}
					],
					[
						{
							text: 'experience difficulty receiving support during journey\n\n',
							style: 'chartText'
						},
						{
							svg: elms[1].outerHTML,
							fit: [240, 240]
						}
					]
				]
			},
			'\n\n',
			{
				alignment: 'justify',
				columns: [
					[
						{
							text: 'experience discrimination\n\n',
							style: 'chartText'
						},
						{
							svg: elms[2].outerHTML,
							fit: [240, 240]
						}
					],
					[
						{
							text: 'personal local bank account in admin\n\n',
							style: 'chartText'
						},
						{
							svg: elms[3].outerHTML,
							fit: [240, 240]
						}
					]
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
