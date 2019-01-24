async function invalidPromiseFunctionAsync1() {}

function invalidPromiseFunctionAsync2() {
	return invalidPromiseFunctionAsync1()
}

const invalidPromiseFunctionAsync3 = () => {
	return invalidPromiseFunctionAsync1()
}

function invalidPromiseFunctionAsync4() {
	return new Promise(() => {})
}

class InvalidPromiseFunctionAsync {
	method() {
		return invalidPromiseFunctionAsync1()
	}
}
