<script lang="ts">
	import pdfMake from 'pdfmake/build/pdfmake';
	import pdfFonts from 'pdfmake/build/vfs_fonts';
	import { onMount } from 'svelte';
	pdfMake.vfs = pdfFonts.pdfMake.vfs;
	import { domToPng } from 'modern-screenshot';

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
				fontSize: 8
			}
		},
		defaultStyle: {
			columnGap: 20
		}
	};

	function handleOpen() {
		let elms = document.querySelectorAll('.chart-wrapper');
		let promises: Promise<any>[] = [];

		elms.forEach((elm) => {
			promises.push(
				domToPng(elm, {
					scale: 3
				})
			);
		});

		if (elms)
			Promise.all(promises).then((values) => {
				console.log(values);

				let content = [
					{
						text: 'IOM Charts\n',
						style: 'header'
					},
					'Some subheading\n\n',
					{
						alignment: 'justify',
						columns: [
							{
								image: values[0],
								width: 250
							},
							{
								image: values[1],
								width: 250
							}
						]
					},
					'\n\n',
					{
						alignment: 'justify',
						columns: [
							{
								image: values[2],
								width: 250
							},
							{
								image: values[3],
								width: 250
							}
						]
					}
				];
				dd.content = content;
				pdfMake.createPdf(dd).open();
			});
	}
</script>

<svelte:window on:load={() => console.log('DOM loaded')} />

<button
	class="mt-8 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 font-medium text-sm rounded"
	on:click={handleOpen}
>
	Open PDF
</button>
