"use strict";
var validForinObject = { a: "a" };
for (var key in validForinObject) {
    if (validForinObject.hasOwnProperty(key)) { }
}
