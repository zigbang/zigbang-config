function invalidAwaitPromise1() {}

async function invalidAwaitPromise2() {
	await invalidAwaitPromise1()
}
