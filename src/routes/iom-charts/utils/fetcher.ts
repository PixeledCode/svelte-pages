export async function dataFetch(name: string) {
	return new Promise<{
		[key: string]: number[] | string[];
	}>((resolve, reject) => {
		fetch(`charts/${name}`)
			.then((res) => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

export function globalFilter(
	filterList: { [key: string]: number | string },
	data: { c: string[]; v: number[][] }
) {
	const filterKeys: {
		[key: number]: number | string;
	} = {};
	// generate [{filter_index: selected filter}] object
	Object.keys(filterList).forEach((key) => {
		if (!Number.isNaN(filterList[key])) {
			const idx = data.c.findIndex((el: string) => el === key);
			filterKeys[idx] = filterList[key];
		}
	});

	const filteredIdx: number[] = [];
	// generate filtered list of indexes
	data.v.forEach((el: number[], index: number) => {
		let valid = true;
		Object.keys(filterKeys).forEach((key) => {
			if (el[Number(key)] !== filterKeys[Number(key)]) {
				valid = false;
				return;
			}
		});
		if (valid) {
			filteredIdx.push(index);
		}
	});

	return filteredIdx;
}

export function filterChart(currentData: { v: number[] }, choices: string[]) {
	const obj: {
		[key: string]: number;
	} = {};

	// convert to instances
	currentData.v.forEach((element: number) => {
		const key = choices[element];
		if (obj[key]) {
			obj[key]++;
		} else {
			obj[key] = 1;
		}
	});

	// convert to percentage
	Object.keys(obj).forEach((key) => {
		obj[key] = Number(((obj[key] / currentData.v.length) * 100).toFixed(2));
	});

	const finalArr: {
		type: number | string;
		value: number;
	}[] = Object.keys(obj).map((key) => {
		return {
			type: key,
			value: obj[key]
		};
	});

	console.log(finalArr);

	return finalArr;
}
