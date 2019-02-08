import chalk from "chalk"
import * as fs from "fs"
import * as path from "path"
import * as shell from "shelljs"

export function hasDependency(projectPath: string, dependency: string) {
	const originPath = shell.pwd().toString()
	shell.cd(projectPath)

	if (!fs.existsSync("./package.json")) {
		shell.echo(chalk.red(`${path} is not node based repository`))
		return false
	}

	const packageJson = JSON.parse(shell.cat(`./package.json`)) as {
		devDependencies?: { [key: string]: string}
		dependencies?: { [key: string]: string}
	}

	const inDevDependencies = packageJson.devDependencies && packageJson.devDependencies[dependency]
	const inDependencies = packageJson.dependencies && packageJson.dependencies[dependency]

	shell.cd(originPath)
	return !!(inDevDependencies || inDependencies)
}
