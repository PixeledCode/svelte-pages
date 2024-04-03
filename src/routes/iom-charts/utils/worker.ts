self.onmessage = (e) => {
	const { currentData, choices, filterList, value, type, rawData } = e.data;

	if (filterList) {
		const data = globalFilter(filterList, value, type, rawData);
		self.postMessage({ filterList: data });
		return;
	}

	const obj = filterChart(currentData, choices);
	self.postMessage({ obj, currentData });
};

function globalFilter(
	filterList: { [key: string]: number },
	value: string,
	type: string,
	data: { c: string[]; v: number[][] }
) {
	// generate [{filter_name: selected filter}] object
	if (value === 'all') {
		filterList[type] = NaN;
	} else {
		filterList[type] = Number(value);
	}

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

function filterChart(currentData: { v: number[] }, choices: string[]) {
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

	return obj;
}
