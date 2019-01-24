class InvalidNoUnnecessaryTypeAssertion {}

function invalidNoUnnecessaryTypeAssertion(param: InvalidNoUnnecessaryTypeAssertion) {
	return param as InvalidNoUnnecessaryTypeAssertion
}
