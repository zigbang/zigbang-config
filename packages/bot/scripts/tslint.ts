#!/usr/bin/env ts-node

import commander from "commander"
import * as shell from "shelljs"

const packageJson = JSON.parse(shell.cat(`./package.json`)) as {
	version: string,
	devDependencies?: { [key: string]: string}
	dependencies?: { [key: string]: string}
}

class Tslint {
	static run() {
		const program = commander
			.version(packageJson.version)
			.command("reports <repo-name> <dir>", "report tslint results")
			.command("summary <dir>", "merge all reports as summary")
			.parse(process.argv)
	}
}

Tslint.run()
