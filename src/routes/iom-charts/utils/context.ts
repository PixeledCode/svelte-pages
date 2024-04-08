import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

type Charts = {
	[key: string]: {
		raw: { v: { [key: string]: number } };
		data: {
			type: number | string;
			value: number;
		}[];
	};
};
type Context = Writable<Charts>;

type FilterContext = Writable<{ [key: string]: number }>;

export function setChartContext() {
	const charts = writable<Charts>({});
	const filters = writable<{ [key: string]: number }>({});
	setContext('charts', charts);
	setContext('worker', { worker: undefined });
	setContext('filters', filters);
}

export function getCharts() {
	return getContext<Context>('charts');
}

export function getFilters() {
	return getContext<FilterContext>('filters');
}

export function getWorker() {
	return getContext<{
		worker: Worker | undefined;
	}>('worker');
}
