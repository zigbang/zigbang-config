async function validNoFloatingPromises1() {

}

async function validNoFloatingPromises2() {
	const result = invalidNoFloatingPromises1()
	result.catch()
}
