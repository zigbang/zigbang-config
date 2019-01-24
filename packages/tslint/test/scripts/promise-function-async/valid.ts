async function validPromiseFunctionAsync1() {}

async function validPromiseFunctionAsync2() {
	return invalidPromiseFunctionAsync1()
}

const validPromiseFunctionAsync3 = async () => {
	return invalidPromiseFunctionAsync1()
}

async function validPromiseFunctionAsync4() {
	return new Promise<void>(() => {})
}

class ValidPromiseFunctionAsync {
	async method() {
		return invalidPromiseFunctionAsync1()
	}
}
