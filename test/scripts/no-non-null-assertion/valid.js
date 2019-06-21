"use strict";
var ValidNoNonNullAssertion = /** @class */ (function () {
    function ValidNoNonNullAssertion() {
    }
    ValidNoNonNullAssertion.prototype.function1 = function () {
    };
    return ValidNoNonNullAssertion;
}());
function validNoNonNullAssertion(instance) {
    if (instance !== undefined) {
        instance.function1();
    }
}
