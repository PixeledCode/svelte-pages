export async function dataFetch(name: string) {
	return new Promise<{ [key: string]: number }>((resolve, reject) => {
		fetch(`charts/${name}.json`)
			.then((res) => res.json())
			.then((data) => {
				setTimeout(() => {
					resolve(data);
				}, Math.random() * 1000);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
