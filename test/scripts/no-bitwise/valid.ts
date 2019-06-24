const validNoBitwise1 = Math.random() > 0.5 ? true : false
const validNoBitwise2 = Math.random() > 0.5 ? true : false
const validNoBitwise3 = Math.random() > 0.5 ? true : false
const validNoBitwise4 = Math.random() > 0.5 ? true : false

const validNoBitwise5 = (validNoBitwise1 || validNoBitwise2) && (validNoBitwise3 || validNoBitwise4)
