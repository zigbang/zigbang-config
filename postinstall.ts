import * as JSONC from "comment-json"
import detectIndent from "detect-indent"
import * as fs from "fs" // TODO: shelljs

const CI_ENV_VARS = ["BUILD_BUILDID", "APPCENTER_BUILD_ID", "CODEBUILD_BUILD_ID"]

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
	const tsconfig = rawTsconfig ? JSONC.parse(rawTsconfig) as { extends?: string } : undefined

	if (!tsconfig) {
		writeFile(pathToTsconfig, JSONC.stringify({ extends: tsconfigExtendsValue }, undefined, tsconfigIndent))
	} else if (tsconfig && tsconfig.extends && tsconfig.extends.includes("@zigbang/config-tsconfig/")) {
		// @zigbang-config가 lerna 버전일 때의 참조를 새버전으로 변경
		tsconfig.extends = tsconfigExtendsValue
		writeFile(pathToTsconfig, JSONC.stringify(tsconfig, undefined, tsconfigIndent))
	} else if (tsconfig && !tsconfig.extends) {
		tsconfig.extends = tsconfigExtendsValue
		writeFile(pathToTsconfig, JSONC.stringify(tsconfig, undefined, tsconfigIndent))
	}
}

function injectZigbangTslint(projectRootPath: string) {
	const pathToTslint = `${projectRootPath}/tslint.json`
	const tslintExtendsValue = "@zigbang/config/tslint.base.json"
	const rawTslint = getFile(pathToTslint)
	const tslintIndent = rawTslint ? detectIndent(rawTslint).indent : "    "
	const tslint = rawTslint ? JSONC.parse(rawTslint) as { extends?: string | string[] } : undefined

	if (!tslint) {
		writeFile(pathToTslint, JSONC.stringify({ extends: [tslintExtendsValue] }, undefined, tslintIndent))
	} else if (tslint && !tslint.extends) {
		tslint.extends = [tslintExtendsValue]
		writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent))
	} else if (tslint && tslint.extends && !Array.isArray(tslint.extends) && tslint.extends.includes("@zigbang/config-tslint/")) {
		// @zigbang-config가 lerna 버전일 때의 참조를 새버전으로 변경
		tslint.extends = tslintExtendsValue
		writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent))
	} else if (tslint && Array.isArray(tslint.extends) && tslint.extends.some((extend) => extend.includes("@zigbang/config-tslint/"))) {
		// @zigbang-config가 lerna 버전일 때의 참조를 새버전으로 변경
		tslint.extends = tslint.extends.map((extend) => extend.includes("@zigbang/config-tslint/") ? tslintExtendsValue : extend)
		writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent))
	} else if (tslint && tslint.extends && !Array.isArray(tslint.extends) && tslint.extends !== tslintExtendsValue) {
		tslint.extends = [tslint.extends, tslintExtendsValue] // The last config you list in the extends array is actually the "base" config
		writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent))
	} else if (tslint && Array.isArray(tslint.extends) && tslint.extends.every((extend) => !extend.includes(tslintExtendsValue))) {
		tslint.extends.push(tslintExtendsValue) // The last config you list in the extends array is actually the "base" config
		writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent))
	}
}

function injectConfigs() {
	if (isRunningOnCi()) return
	const PROJECT_ROOT_PATH = `${process.cwd()}/../../..`
	if (!PROJECT_ROOT_PATH.includes("node_modules")) return // When developing zigbang-config
	injectZigbangTsconfig(PROJECT_ROOT_PATH)
	injectZigbangTslint(PROJECT_ROOT_PATH)
}

function isRunningOnCi() {
	for (const envVar of CI_ENV_VARS) {
		if (process.env[envVar] !== undefined) return true
	}

	return false
}

injectConfigs()
