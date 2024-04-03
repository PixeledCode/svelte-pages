import { filterChart, globalFilter } from './fetcher';

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
