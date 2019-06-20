import * as fs from "fs" // TODO: shelljs

function getJson<T>(path: string): T | undefined {
	try {
		// tslint:disable-next-line: no-var-requires
		return require(path) as T
	} catch {
		return undefined
	}
}

function writeJson(path: string, data: object) {
	fs.writeFileSync(path, JSON.stringify(data, undefined, 4))
}

const pathToTsconfig = `${process.cwd()}/tsconfig.json`
const pathToTslint = `${process.cwd()}/tslint.json`

const tsconfigExtendsValue = "./node_modules/@zigbang/config-tsconfig/node.json" // TODO: Determine what type of tsconfig.json should be used.
const tslintExtendsValue = "@zigbang/config-tslint/tslint.json"

const tsconfig = getJson<{ extends?: string }>(pathToTsconfig)
const tslint = getJson<{ extends?: string | string[] }>(pathToTslint)

if (!tsconfig) {
	writeJson(pathToTsconfig, { extends: tsconfigExtendsValue })
} else if (tsconfig && !tsconfig.extends) {
	tsconfig.extends = "./node_modules/@zigbang/config-tsconfig/node.json"
	writeJson(pathToTsconfig, tsconfig)
}

if (!tslint) {
	writeJson(pathToTslint, { extends: [tslintExtendsValue] })
} else if (tslint && !tslint.extends) {
	tslint.extends = [tslintExtendsValue]
	writeJson(pathToTslint, tslint)
} else if (tslint && tslint.extends && !Array.isArray(tslint.extends) && tslint.extends !== tslintExtendsValue) {
	tslint.extends = [tslint.extends, tslintExtendsValue] // The last config you list in the extends array is actually the "base" config
	writeJson(pathToTslint, tslint)
} else if (tslint && Array.isArray(tslint.extends) && !tslint.extends.includes(tslintExtendsValue)) {
	tslint.extends.push(tslintExtendsValue) // The last config you list in the extends array is actually the "base" config
	writeJson(pathToTslint, tslint)
}
