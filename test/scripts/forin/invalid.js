"use strict";
var invalidForinObject = { a: "a" };
for (var key in invalidForinObject) {
    key;
}
