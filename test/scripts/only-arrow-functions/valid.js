"use strict";
// allow-named-functions
var validOnlyArrowFunctions1 = function validOnlyArrowFunctions2() { };
function validOnlyArrowFunctions3() { }
// allow-declarations
function validOnlyArrowFunctions4() {
    return;
}
// default
var validOnlyArrowFunctions5 = function () { };
