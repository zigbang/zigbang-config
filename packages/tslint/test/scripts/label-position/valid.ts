function validLabelPosition() {
	lab1: for (let i1 = 0; i1 < 5; i1 += 1) {
		break lab1
	}

	let i2 = 0
	lab2: do {
		i2 += 1
		break lab2
	} while (i2 < 10)
}
