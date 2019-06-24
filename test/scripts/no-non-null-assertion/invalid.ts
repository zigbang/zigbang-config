class InvalidNoNonNullAssertion {
	function1() {

	}
}

function invalidNoNonNullAssertion(instance: ValidNoNonNullAssertion | undefined) {
	instance!.function1()
}
