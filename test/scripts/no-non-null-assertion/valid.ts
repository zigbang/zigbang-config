class ValidNoNonNullAssertion {
	function1() {

	}
}

function validNoNonNullAssertion(instance: ValidNoNonNullAssertion | undefined) {
	if (instance !== undefined) {
		instance.function1()
	}
}
