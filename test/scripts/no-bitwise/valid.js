"use strict";
var validNoBitwise1 = Math.random() > 0.5 ? true : false;
var validNoBitwise2 = Math.random() > 0.5 ? true : false;
var validNoBitwise3 = Math.random() > 0.5 ? true : false;
var validNoBitwise4 = Math.random() > 0.5 ? true : false;
var validNoBitwise5 = (validNoBitwise1 || validNoBitwise2) && (validNoBitwise3 || validNoBitwise4);
