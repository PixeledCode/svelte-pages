<script lang="ts">
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

<button
	class="mt-8 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 font-medium text-sm rounded"
	on:click={handleOpen}
>
	Open PDF
</button>
