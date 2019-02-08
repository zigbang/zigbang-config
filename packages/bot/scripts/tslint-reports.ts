#!/usr/bin/env ts-node

import chalk from "chalk"
import * as child from "child_process"
import commander from "commander"
import * as fs from "fs"
import * as shell from "shelljs"

import { hasDependency } from "./dependency"

const packageJson = JSON.parse(shell.cat(`./package.json`)) as {
	version: string,
	devDependencies?: { [key: string]: string}
	dependencies?: { [key: string]: string}
}

function getTargetDirectories(repoName: string, dir: string) {
	const originPath = shell.pwd().toString()
	shell.cd(`${dir}/sub/${repoName}`)

	const isLernaRepo = hasDependency(`./`, "lerna")

	let targetDir: { path: string, name: string }[] = []
	if (isLernaRepo) {
		targetDir = shell.ls(`${dir}/sub/${repoName}/packages/`).toString().split(",").map((name) => {
			return {
				name,
				path: `${dir}/sub/${repoName}/packages/${name}`
			}
		})
	} else {
		targetDir = [{ path: `${dir}/sub/${repoName}`, name: repoName }]
	}

	shell.cd(originPath)

	return targetDir
}

function tslint(path: string, name: string, dir: string) {
	const originPath = shell.pwd().toString()

	if (!hasDependency(path, "typescript")) {
		shell.echo(chalk.red(`${name} does not have typescript dependencies`))
		shell.touch(`${dir}/sub/.results/${name}.json`)
		return
	}

	if (!hasDependency(path, "tslint")) {
		shell.echo(chalk.red(`${name} does not have tslint dependencies`))
		shell.touch(`${dir}/sub/.results/${name}.json`)
		return
	}

	if (!fs.existsSync(path + "/tsconfig.json")) {
		shell.echo(chalk.red(`${name} does not have tsconfig.json`))
		shell.touch(`${dir}/sub/.results/${name}.json`)
		return
	}

	shell.cd(path)
	shell.echo(chalk.green(`linting: ${shell.pwd().toString()}`))

	child.execSync(
		`npx tslint --project . --config ${originPath}/${dir}/packages/tslint/tslint.json -t json -o ${originPath}/${dir}/sub/.results/${name}.json --force`,
		{ encoding: "utf8", stdio: "inherit" }
	)

	shell.cd(originPath)
}

function resultSummary(repoName: string, dir: string) {
	const resultFiles = shell.ls(`${dir}/sub/.results/`).toString().split(",")

	const summaries = []

	for (const file of resultFiles) {
		if (!shell.cat(`${dir}/sub/.results/${file}`).trim()) {
			summaries.push({
				name: file.replace(".json", ""),
				total: 0,
				errors: "Not lintable repository"
			})
			continue
		}

		const result = JSON.parse(shell.cat(`${dir}/sub/.results/${file}`)) as { ruleName: string, fix?: {} }[]

		let total = 0
		const errorMap: { [rulename: string]: number } = {}
		for (const error of result) {
			if (!error.fix) {
				if (!errorMap[error.ruleName]) {
					errorMap[error.ruleName] = 0
				}
				errorMap[error.ruleName] = errorMap[error.ruleName] + 1
				total += 1
			}
		}

		summaries.push({
			name: file.replace(".json", ""),
			total: total,
			errors: errorMap
		})
	}

	shell.echo(JSON.stringify(summaries)).to(`${dir}/sub/.results/${repoName}-result.json`)
}

class TslintReports {
	static run() {
		const program = commander
			.version(packageJson.version)
			.option("-r, --repo-name <repo-name>", "target repo name")
			.option("-d, --dir <dir>", "working directory")
			.parse(process.argv)

		if (!program.repoName || !program.dir) {
			program.help()
			process.exit(1)
		}

		const { repoName, dir } = program

		shell.rm("-rf", `${dir}/sub/.results`)
		shell.mkdir(`${dir}/sub/.results`)

		const projects = getTargetDirectories(repoName as string, dir as string)
		projects.forEach((project) => { tslint(project.path, project.name, dir as string) })
		resultSummary(repoName as string, dir as string)
	}
}

TslintReports.run()
