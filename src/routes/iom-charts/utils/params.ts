import { replaceState } from '$app/navigation';

export function getParams() {
	const params = new URLSearchParams(window.location.search);
	const paramsObj: {
		[key: string]: string;
	} = {};

	for (const [key, value] of params) {
		paramsObj[key] = value;
	}

	return paramsObj;
}

export function setParams(params: { [key: string]: string }) {
	const prevParams = getParams();
	const newParams = { ...prevParams, ...params };

	const url = new URL(window.location.href);

	for (const key in newParams) {
		url.searchParams.set(key, newParams[key]);
	}

	replaceState(url.toString(), newParams);

	return newParams;
}
