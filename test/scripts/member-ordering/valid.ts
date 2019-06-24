class ValidMemberOrdering1 {
	static field1 = 0
	static function1() {
		this.field3
		this.function3()
	}

	protected static field2 = 0
	protected static function2() {}

	private static readonly field3 = 0
	private static function3() {}

	field4 = 0
	protected field5 = 0
	private readonly field6 = 0

	constructor() {
		1
	}

	function4() {

	}

	protected function5() {
		this.function6()
	}

	private function6() {
		this.field6
	}
}

class ValidMemberOrdering2 {
	static field1 = 0
	static function1() {
		this.field3
		this.function3()
	}

	protected static field2 = 0
	protected static function2() {}

	private static readonly field3 = 0
	private static function3() {}

	field4 = 0
	protected field5 = 0
	private readonly field6 = 0

	protected constructor() {
		1
	}

	function4() {

	}

	protected function5() {
		this.function6()
	}

	private function6() {
		this.field6
	}
}

class ValidMemberOrdering3 {
	static field1 = 0
	static function1() {
		this.field3
		this.function3()
	}

	protected static field2 = 0
	protected static function2() {}

	private static readonly field3 = 0
	private static function3() {}

	field4 = 0
	protected field5 = 0
	private readonly field6 = 0

	private constructor() {
		1
	}

	function4() {

	}

	protected function5() {
		this.function6()
	}

	private function6() {
		this.field6
	}
}
