const validNoForInArray = ["A", "B", "C"]

for (const value of validNoForInArray) {
	value
}

validNoForInArray.forEach((value, index) => {
	value
	index
})
