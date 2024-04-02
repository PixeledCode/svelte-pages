export async function dataFetch(name: string) {
	return new Promise<{
		[key: string]: number[] | string[];
	}>((resolve, reject) => {
		fetch(`charts/${name}`)
			.then((res) => res.json())
			.then((data) => {
				resolve(data);
				// uncomment to add random delay
				// setTimeout(() => {
				// 	resolve(data);
				// }, Math.random() * 1000);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
