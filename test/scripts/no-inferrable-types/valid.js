"use strict";
var ValidNoInferrableTypes = /** @class */ (function () {
    function ValidNoInferrableTypes() {
        this.value1 = 3;
        this.value2 = "text";
        this.value3 = true;
        this.value4 = { a: 3 };
        this.value5 = { a: 3 };
    }
    ValidNoInferrableTypes.prototype.foo = function (param1) {
        if (param1 === void 0) { param1 = 5; }
        param1 + 1;
    };
    return ValidNoInferrableTypes;
}());
