import chalk from "chalk"
import * as child from "child_process"
import * as fs from "fs"
import * as shell from "shelljs"

function testTslint() {
	shell.rm("-rf", ".results")
	shell.mkdir(`.results`)

	const { repoUrl, repoName, targetBranch } = readParams()
	downloadRepo(repoUrl, repoName, targetBranch)

	const isLernaRepo = hasDependency(`./.archive/${repoName}`, "lerna")

	installPackages(repoName, isLernaRepo)
	const targetDirs = getTargetDirectories(repoName, isLernaRepo)

	for (const targetDir of targetDirs) {
		tslint(targetDir.path, targetDir.name)
	}

	resultSummary(repoName)
}

function readParams() {
	const args = process.argv.slice(2)
	if (args.length !== 3) {
		shell.echo(chalk.red(`expected 3 arguments but got ${args.length}`))
	}

	return {
		repoUrl: args[0],
		repoName: args[1],
		targetBranch: args[2]
	}
}

function downloadRepo(repoUrl: string, repoName: string, targetBranch: string) {
	shell.rm("-rf", `.archive`)
	shell.mkdir(`.archive`)

	child.execSync(
		`git archive -v --format=zip --output=.archive/${repoName}.zip --remote=${repoUrl} ${targetBranch}`,
		{ encoding: "utf8", stdio: "inherit" }
	)

	child.execSync(
		`unzip ./.archive/${repoName}.zip -d ./.archive/${repoName}`,
		{ encoding: "utf8", stdio: "inherit" }
	)
}

function hasDependency(path: string, dependency: string) {
	const originPath = shell.pwd()
	shell.cd(path)

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

function installPackages(repoName: string, lernaRepo: boolean) {
	shell.cd(`./.archive/${repoName}`)
	if (lernaRepo) {
		child.execSync(`lerna bootstrap`, { encoding: "utf8", stdio: "inherit" })
	} else {
		child.execSync(`yarn install`, { encoding: "utf8", stdio: "inherit" })
	}
	shell.cd(`../../`)
}

function getTargetDirectories(repoName: string, lernaRepo: boolean) {
	let targetDir: { path: string, name: string }[] = []
	if (lernaRepo) {
		targetDir = shell.ls(`./.archive/${repoName}/packages/`).toString().split(",").map((name) => {
			return {
				name,
				path: `./.archive/${repoName}/packages/${name}`
			}
		})
	} else {
		targetDir = [{ path: `./.archive/${repoName}`, name: repoName }]
	}

	return targetDir
}

function tslint(path: string, name: string) {
	const originPath = shell.pwd()
	if (!hasDependency(path, "typescript")) {
		shell.echo(chalk.red(`${name} does not have typescript dependencies`))
		shell.touch(`${originPath}/.results/${name}.json`)
		return
	}

	if (!hasDependency(path, "tslint")) {
		shell.echo(chalk.red(`${name} does not have tslint dependencies`))
		shell.touch(`${originPath}/.results/${name}.json`)
		return
	}

	if (!fs.existsSync(path + "/tsconfig.json")) {
		shell.echo(chalk.red(`${name} does not have tsconfig.json`))
		shell.touch(`${originPath}/.results/${name}.json`)
		return
	}

	shell.cd(path)
	shell.echo(chalk.green(`linting: ${shell.pwd()}`))

	child.execSync(
		`npx tslint --project . --config ${originPath}/packages/tslint/tslint.json -t json -o ${originPath}/.results/${name}.json --force`,
		{ encoding: "utf8", stdio: "inherit" }
	)

	shell.cd(originPath)
}

function resultSummary(repoName: string) {
	const resultFiles = shell.ls(`./.results/`).toString().split(",")

	const summaries = []

	for (const file of resultFiles) {

		if (!shell.cat(`./.results/${file}`).trim()) {
			summaries.push({
				name: file.replace(".json", ""),
				total: 0,
				errors: "Not lintable repository"
			})
			continue
		}

		const result = JSON.parse(shell.cat(`./.results/${file}`)) as { ruleName: string, fix?: {} }[]

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

	shell.echo(JSON.stringify(summaries)).to(`./.results/${repoName}.json`)
}

testTslint()
