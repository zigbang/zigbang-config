// allow-named-functions
const validOnlyArrowFunctions1 = function validOnlyArrowFunctions2() {}
function validOnlyArrowFunctions3() {}

// allow-declarations
function validOnlyArrowFunctions4() {
	return
}

// default
const validOnlyArrowFunctions5 = () => {}
