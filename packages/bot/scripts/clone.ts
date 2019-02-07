#!/usr/bin/env ts-node

import chalk from "chalk"
import * as child from "child_process"
import commander from "commander"
import * as shell from "shelljs"

import { hasDependency } from "./dependency"

const packageJson = JSON.parse(shell.cat(`./package.json`)) as {
	version: string,
	devDependencies?: { [key: string]: string}
	dependencies?: { [key: string]: string}
}

function clone(url: string, name: string, branch: string, dir: string) {
	const originPath = shell.pwd().toString()
	shell.rm("-rf", `${dir}/sub`)
	shell.mkdir(`${dir}/sub`)
	shell.cd(`${dir}/sub`)

	child.execSync(`git clone ${url} ${name}`)

	shell.cd(`./${name}`)
	child.execSync(`git checkout ${branch}`)

	const isLernaRepo = hasDependency(`./`, "lerna")
	if (isLernaRepo) {
		child.execSync(`lerna bootstrap`, { encoding: "utf8", stdio: "inherit" })
	} else {
		child.execSync(`yarn install`, { encoding: "utf8", stdio: "inherit" })
	}

	const hasHusky = hasDependency(`./`, "husky")
	if (hasHusky) {
		child.execSync(`yarn remove husky`, { encoding: "utf8", stdio: "inherit" })
	}

	shell.cd(originPath)
}

class Clone {
	static run() {
		const program = commander
			.version(packageJson.version)
			.option("-u, --repo-url <repo-url>", "target repo url")
			.option("-n, --repo-name <repo-name>", "target repo name")
			.option("-b, --branch <branch>", "target branch name")
			.option("-d, --dir <dir>", "working directory")
			.parse(process.argv)

		if (!program.repoUrl) {
			shell.echo(chalk.red(`repo url not provided`))
			program.help()
			process.exit(1)
		}

		if (!program.repoName) {
			shell.echo(chalk.red(`repo name not provided`))
			program.help()
			process.exit(1)
		}

		if (!program.branch) {
			shell.echo(chalk.red(`target branch not provided`))
			program.help()
			process.exit(1)
		}

		if (!program.dir) {
			shell.echo(chalk.red(`dir not provided`))
			program.help()
			process.exit(1)
		}

		const { repoUrl, repoName, branch, dir } = program
		clone(
			repoUrl as string,
			repoName as string,
			branch as string,
			dir as string
		)
	}
}

Clone.run()
