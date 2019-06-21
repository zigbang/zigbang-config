"use strict";
function invalidBanCommaOperator() {
    var x = 0;
    return (x += 1, x);
}
