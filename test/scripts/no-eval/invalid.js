"use strict";
function invalidNoEval(obj) {
    return eval(obj);
}
invalidNoEval("{a:(4-1), b:function(){}, c:new Date()}");
