"use strict";
var invalidNoBitwise1 = Math.random() > 0.5 ? 1 : 0;
var invalidNoBitwise2 = Math.random() > 0.5 ? 1 : 0;
var invalidNoBitwise3 = Math.random() > 0.5 ? 1 : 0;
var invalidNoBitwise4 = Math.random() > 0.5 ? 1 : 0;
var invalidNoBitwise5 = (invalidNoBitwise1 | invalidNoBitwise2) & (invalidNoBitwise3 | invalidNoBitwise4);
