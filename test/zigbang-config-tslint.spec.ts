// tslint:disable-next-line: no-implicit-dependencies
import { expect } from "chai"
import * as fs from "fs"
// tslint:disable-next-line: no-implicit-dependencies
import * as glob from "glob"
import * as path from "path"

import { execSync } from "child_process"

const baseDir = "./test/scripts/"

function getDirectories(srcpath: string) {
  	return fs.readdirSync(srcpath).filter((file) => {
		return fs.statSync(path.join(srcpath, file)).isDirectory()
  	})
}

function tslint(targetFile: string) {
	try {
		execSync(`node ./node_modules/.bin/tslint --project . ${targetFile}`)
  	} catch (e) {
		const error = e as { stdout: Buffer, stderr: Buffer }
		throw new Error(`Message: ${error.toString()}, stdout: ${error.stdout && error.stdout.toString()}, stderr: ${error.stderr && error.stderr.toString()}`)
  	}
}

describe("zigbang tslint", () => {
  	getDirectories(baseDir).forEach((dir) => {
		describe(dir, () => {
			it("should pass for valid.ts", () => {
				tslint(`${baseDir}${dir}/valid*.*`)
			})
			glob.sync(`${baseDir}${dir}/invalid*.*`).forEach((file) => {
				it(`should fail for ${path.basename(file)}`, () => {
					expect(() => tslint(file)).to.throw()
				})
			})
		})
  	})
})
