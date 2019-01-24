import * as shell from "shelljs"

function mergeSummaries() {
	shell.cd("./.results/")
	const summaries = shell.ls(`./`).toString().split(",")

	interface Summary {
		name: string
		totoal: number
		errors: { [ ruleName: string ]: number } | string
	}

	let result: Summary[] = []

	for (const file of summaries) {
		const summary = JSON.parse(shell.cat(file)) as Summary[]
		result = result.concat(summary)
	}

	shell.echo(JSON.stringify(result)).to("result.json")
}

mergeSummaries()
