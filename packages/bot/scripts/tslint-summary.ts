#!/usr/bin/env ts-node

import commander from "commander"
import * as shell from "shelljs"

const packageJson = JSON.parse(shell.cat(`./package.json`)) as {
	version: string,
	devDependencies?: { [key: string]: string}
	dependencies?: { [key: string]: string}
}

function tslintSummary(dir: string) {
	const originPath = shell.pwd().toString()

	shell.cd(`${dir}/sub/.results/`)
	const files = shell.ls(`./*-result.json`).toString().split(",")

	interface Summary {
		name: string
		totoal: number
		errors: { [ ruleName: string ]: number } | string
	}

	let result: Summary[] = []

	for (const file of files) {
		const summary = JSON.parse(shell.cat(file)) as Summary[]
		result = result.concat(summary)
	}

	shell.echo(JSON.stringify(result)).to("./result.json")
	shell.cd(originPath)
}

class TslintSummary {
	static run() {
		const program = commander
			.version(packageJson.version)
			.option("-d, --dir <dir>", "working directory")
			.parse(process.argv)

		if (!program.dir) {
			program.help()
			process.exit(1)
		}

		const { dir } = program
		tslintSummary(dir as string)
	}
}

TslintSummary.run()
