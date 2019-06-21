"use strict";
var ValidMemberAccess1 = /** @class */ (function () {
    function ValidMemberAccess1() {
        this.field1 = 1;
        this.field2 = 1;
    }
    return ValidMemberAccess1;
}());
var ValidMemberAccess2 = /** @class */ (function () {
    function ValidMemberAccess2() {
    }
    Object.defineProperty(ValidMemberAccess2.prototype, "accessor1", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return ValidMemberAccess2;
}());
var ValidMemberAccess3 = /** @class */ (function () {
    function ValidMemberAccess3() {
        1;
    }
    return ValidMemberAccess3;
}());
var ValidMemberAccess4 = /** @class */ (function () {
    function ValidMemberAccess4() {
        1;
    }
    return ValidMemberAccess4;
}());
