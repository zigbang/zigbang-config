#!/usr/bin/env ts-node

import chalk from "chalk"
import * as child from "child_process"
import commander from "commander"
import * as path from "path"
import * as shell from "shelljs"

import packageJson from "../package.json"

function prettier(sourcePath: string, configPath: string) {
	shell.echo(chalk.green(`> running prettier`))

	const absoluteConfigPath = path.resolve(shell.pwd().toString(), configPath)
	const command = `npx prettier --write ${sourcePath}/*.{ts,tsx} --config ${path.resolve(shell.pwd().toString(), absoluteConfigPath)}`
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
		child.execSync(`git commit -m "[CI] prettier"`, {
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
	.usage("[options] <source path>")
	.option("-c, --config <config>", "config file path")
	.parse(process.argv)

if (!program.args[0]) {
	shell.echo(chalk.red(`source path not given`))
	program.help()
	process.exit(1)
}

if (!program.config) {
	shell.echo(chalk.red(`config not given`))
	program.help()
	process.exit(1)
}

const source = program.args[0]
const config = program.config as string
prettier(source, config)
commit()
