import detectIndent from "detect-indent"
import * as fs from "fs" // TODO: shelljs

function getFile(path: string) {
	try {
		return fs.readFileSync(path).toString()
	} catch {
		return undefined
	}
}

function writeFile(path: string, data: string) {
	fs.writeFileSync(path, data)
}

function injectZigbangTsconfig(projectRootPath: string) {
	const pathToTsconfig = `${projectRootPath}/tsconfig.json`
	const tsconfigExtendsValue = "./node_modules/@zigbang/config/tsconfig.base.json"
	const rawTsconfig = getFile(pathToTsconfig)
	const tsconfigIndent = rawTsconfig ? detectIndent(rawTsconfig).indent : "    "
	const tsconfig = rawTsconfig ? JSON.parse(rawTsconfig) as { extends?: string } : undefined

	if (!tsconfig) {
		writeFile(pathToTsconfig, JSON.stringify({ extends: tsconfigExtendsValue }, undefined, tsconfigIndent))
	} else if (tsconfig && !tsconfig.extends) {
		tsconfig.extends = tsconfigExtendsValue
		writeFile(pathToTsconfig, JSON.stringify(tsconfig, undefined, tsconfigIndent))
	}
}

function injectZigbangTslint(projectRootPath: string) {
	const pathToTslint = `${projectRootPath}/tslint.json`
	const tslintExtendsValue = "@zigbang/config/tslint.json"
	const rawTslint = getFile(pathToTslint)
	const tslintIndent = rawTslint ? detectIndent(rawTslint).indent : "    "
	const tslint = rawTslint ? JSON.parse(rawTslint) as { extends?: string | string[] } : undefined

	if (!tslint) {
		writeFile(pathToTslint, JSON.stringify({ extends: [tslintExtendsValue] }, undefined, tslintIndent))
	} else if (tslint && !tslint.extends) {
		tslint.extends = [tslintExtendsValue]
		writeFile(pathToTslint, JSON.stringify(tslint, undefined, tslintIndent))
	} else if (tslint && tslint.extends && !Array.isArray(tslint.extends) && tslint.extends !== tslintExtendsValue) {
		tslint.extends = [tslint.extends, tslintExtendsValue] // The last config you list in the extends array is actually the "base" config
		writeFile(pathToTslint, JSON.stringify(tslint, undefined, tslintIndent))
	} else if (tslint && Array.isArray(tslint.extends) && tslint.extends.every((extend) => !extend.includes(tslintExtendsValue))) {
		tslint.extends.push(tslintExtendsValue) // The last config you list in the extends array is actually the "base" config
		writeFile(pathToTslint, JSON.stringify(tslint, undefined, tslintIndent))
	}
}

function injectConfigs() {
	const PROJECT_ROOT_PATH = `${process.cwd()}/../..`
	if (!PROJECT_ROOT_PATH.includes("node_modules")) return // When developing zigbang-config
	injectZigbangTsconfig(PROJECT_ROOT_PATH)
	injectZigbangTslint(PROJECT_ROOT_PATH)
}

injectConfigs()
