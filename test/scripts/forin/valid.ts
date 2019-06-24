const validForinObject = { a: "a" }
for (const key in validForinObject) {
	if (validForinObject.hasOwnProperty(key)) { }
}
