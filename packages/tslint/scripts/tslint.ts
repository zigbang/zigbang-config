#!/usr/bin/env ts-node

import chalk from "chalk"
import * as child from "child_process"
import commander from "commander"
import * as path from "path"
import * as shell from "shelljs"

import packageJson from "../package.json"

function tslint(projectPath: string, configPath: string) {
	shell.echo(chalk.green(`> running tslint`))

	const absoluteProjectPath = path.resolve(shell.pwd().toString(), projectPath)
	const absoluteConfigPath = path.resolve(shell.pwd().toString(), configPath)
	const command = `npx tslint --project ${absoluteProjectPath} --config ${absoluteConfigPath} --fix --force`
	child.execSync(command, { encoding: "utf8", stdio: "inherit" })
}

function commit() {
	const diff = child.execSync("git --no-pager diff", {
		encoding: "UTF-8"
	})
	if (!!diff) {
		shell.echo(chalk.green(`> committing modifed files`))
		child.execSync(`git config --global user.email "ci@zigbang.com"`)
		child.execSync(`git config --global user.name "CI"`)

		child.execSync(`git ls-files ./ | grep -e '\.ts$' -e '\.tsx$' | xargs git add`, {
			encoding: "UTF-8",
			stdio: "inherit"
		})
		child.execSync(`git commit -m "[CI] tslint"`, {
			encoding: "UTF-8",
			stdio: "inherit"
		})
		child.execSync(`git push --set-upstream origin ${process.env.CIRCLE_BRANCH}`, {
			encoding: "UTF-8",
			stdio: "inherit"
		})
	}
}

const program = commander
	.version(packageJson.version)
	.option("-p, --project <project>", "project root")
	.option("-c, --config <config>", "config file")
	.parse(process.argv)

if (!program.project) {
	shell.echo(chalk.red(`project argument not given`))
	program.help()
	process.exit(1)
}

if (!program.config) {
	shell.echo(chalk.red(`config argument not given`))
	program.help()
	process.exit(1)
}

const projectRoot = program.project as string
const configFile = program.config as string
tslint(projectRoot, configFile)
commit()
