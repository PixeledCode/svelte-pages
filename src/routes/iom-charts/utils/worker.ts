const queue: number[] = [];

self.onmessage = (e) => {
	const { data, id } = e.data;
	queue.push(id);
	console.log(queue);

	self.postMessage({ data, queue });
};
