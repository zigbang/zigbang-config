import chalk from "chalk"
import * as child from "child_process"
import * as shell from "shelljs"

export function commit(msg: string, dir: string) {
	const originPath = shell.pwd().toString()
	shell.cd(dir)

	const diff = child.execSync("git --no-pager diff", {
		encoding: "UTF-8"
	})

	if (!!diff) {
		const branch = child.execSync(`git rev-parse --abbrev-ref HEAD`, { encoding: "utf8" })

		shell.echo(chalk.green(`> committing modifed files`))
		child.execSync(`git config --global user.email "ci@zigbang.com"`)
		child.execSync(`git config --global user.name "CI"`)

		child.execSync(`git ls-files ./ | grep -e '\.ts$' -e '\.tsx$' | xargs git add`, {
			encoding: "UTF-8",
			stdio: "inherit"
		})
		child.execSync(`git commit -m "${msg}"`, {
			encoding: "UTF-8",
			stdio: "inherit"
		})
		child.execSync(`git push --set-upstream origin ${branch}`, {
			encoding: "UTF-8",
			stdio: "inherit"
		})
	}

	shell.cd(originPath)
}
