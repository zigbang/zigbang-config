class ValidMemberAccess1 {
	field1 = 1
	field2 = 1
}

class ValidMemberAccess2 {
	get accessor1() {
		return 0
	}
}

class ValidMemberAccess3 {
	constructor() {
		1
	}
}

class ValidMemberAccess4 {
	private constructor() {
		1
	}
}
