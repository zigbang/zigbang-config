"use strict";
var InvalidNoNonNullAssertion = /** @class */ (function () {
    function InvalidNoNonNullAssertion() {
    }
    InvalidNoNonNullAssertion.prototype.function1 = function () {
    };
    return InvalidNoNonNullAssertion;
}());
function invalidNoNonNullAssertion(instance) {
    instance.function1();
}
