const invalidNoBitwise1 = Math.random() > 0.5 ? 1 : 0
const invalidNoBitwise2 = Math.random() > 0.5 ? 1 : 0
const invalidNoBitwise3 = Math.random() > 0.5 ? 1 : 0
const invalidNoBitwise4 = Math.random() > 0.5 ? 1 : 0

const invalidNoBitwise5 = (validNoBitwise1 | validNoBitwise2) & (validNoBitwise3 | validNoBitwise4)
