export async function dataFetch(name: string) {
	return new Promise<number[]>((resolve, reject) => {
		fetch(`charts/${name}`)
			.then((res) => res.json())
			.then((data) => {
				resolve(data.v);
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
