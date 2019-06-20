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

const projectRootPath = `${process.cwd()}/../../..`

const pathToTsconfig = `${projectRootPath}/tsconfig.json`
const pathToTslint = `${projectRootPath}/tslint.json`

const tsconfigExtendsValue = "./node_modules/@zigbang/config-tsconfig/node.json" // TODO: Determine what type of tsconfig.json should be used.
const tslintExtendsValue = "@zigbang/config-tslint/tslint.json"

const rawTsconfig = getFile(pathToTsconfig)
const rawTslint = getFile(pathToTslint)

const tsconfigIndent = rawTsconfig ? detectIndent(rawTsconfig).indent : "    "
const tslintIndent = rawTslint ? detectIndent(rawTslint).indent : "    "

const tsconfig = rawTsconfig ? JSON.parse(rawTsconfig) as { extends?: string } : undefined
const tslint = rawTslint ? JSON.parse(rawTslint) as { extends?: string | string[] } : undefined

if (!tsconfig) {
	writeFile(pathToTsconfig, JSON.stringify({ extends: tsconfigExtendsValue }, undefined, tsconfigIndent))
} else if (tsconfig && !tsconfig.extends) {
	tsconfig.extends = tsconfigExtendsValue
	writeFile(pathToTsconfig, JSON.stringify(tsconfig, undefined, tsconfigIndent))
}

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
