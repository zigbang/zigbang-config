#!/usr/bin/env ts-node

import chalk from "chalk"
import * as child from "child_process"
import commander from "commander"
import * as shell from "shelljs"

import { commit } from "./commit"
import { hasDependency } from "./dependency"

const packageJson = JSON.parse(shell.cat(`./package.json`)) as {
	version: string,
	devDependencies?: { [key: string]: string}
	dependencies?: { [key: string]: string}
}

function prettier(repoName: string, prettierSrc: string, prettierConfig: string, dir: string) {
	const originPath = shell.pwd().toString()
	shell.cd(`${dir}/sub/${repoName}`)

	const hasPrettier = hasDependency(`./`, "prettier")
	if (!hasPrettier) {
		shell.echo(chalk.red(`${repoName} has no prettier dependency`))
		shell.exit(1)
	}

	child.execSync(`npx prettier --write --config ${prettierConfig} ${shell.pwd().toString()}/${prettierSrc}`, { encoding: "utf8", stdio: "inherit" })

	shell.cd(originPath)
}

function tslint(repoName: string, projectPath: string, tslintConfig: string, dir: string) {
	const originPath = shell.pwd().toString()
	shell.cd(`${dir}/sub/${repoName}`)

	const hasTslint = hasDependency(`./`, "tslint")
	if (!hasTslint) {
		shell.echo(chalk.red(`${repoName} has no tslint dependency`))
		shell.exit(1)
	}

	child.execSync(`npx tslint --project ${projectPath} --config ${tslintConfig} --fix --force`, { encoding: "utf8", stdio: "inherit" })

	shell.cd(originPath)
}

class Lint {
	static run() {
		const program = commander
			.version(packageJson.version)
			.option("-r, --repo-name <repo-name>", "target repo name")
			.option("-s, --prettier-src <prettier-src>", "prettier src")
			.option("-c, --prettier-config <prettier-config>", "prettier config file")
			.option("-p, --project-path <project-path>", "typescript project path")
			.option("-t, --tslint-config <tslint-config>", "tslint config file")
			.option("-d, --dir <dir>", "working directory")
			.parse(process.argv)

		if (!program.repoName || !program.prettierSrc || !program.prettierConfig || !program.projectPath || !program.tslintConfig || !program.dir) {
			program.help()
			process.exit(1)
		}

		const { repoName, prettierSrc, prettierConfig, projectPath, tslintConfig, dir } = program
		prettier(
			repoName as string,
			prettierSrc as string,
			prettierConfig as string,
			dir as string
		)

		tslint(
			repoName as string,
			projectPath as string,
			tslintConfig as string,
			dir as string
		)

		commit("[CI] apply prettier && tslint", `${dir}/sub/${repoName}`)
	}
}

Lint.run()
