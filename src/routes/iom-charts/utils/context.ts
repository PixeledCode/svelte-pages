import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

type Charts = {
	[key: string]: {
		[key: string]: number;
	};
};
type Context = Writable<Charts>;

export function setChartContext() {
	const charts = writable<Charts>({});
	setContext('charts', charts);
}

export function getCharts() {
	return getContext<Context>('charts');
}
