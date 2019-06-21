"use strict";
var InvalidMemberAccess1 = /** @class */ (function () {
    function InvalidMemberAccess1() {
        this.member1 = 1;
    }
    return InvalidMemberAccess1;
}());
var InvalidMemberAccess2 = /** @class */ (function () {
    function InvalidMemberAccess2() {
    }
    Object.defineProperty(InvalidMemberAccess2.prototype, "accessor1", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return InvalidMemberAccess2;
}());
