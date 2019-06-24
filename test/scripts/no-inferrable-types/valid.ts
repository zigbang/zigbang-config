class ValidNoInferrableTypes {
	value1 = 3
	value2 = "text"
	value3 = true
	value4 = { a: 3 }
	value5: { a: number } = { a: 3 }

	foo(param1: number = 5) {
		param1 + 1
	}
}
