import * as fs from "fs"
import * as path from "path"

import { expect } from "chai"
import { execSync } from "child_process"
import * as glob from "glob"

const baseDir = "./test/scripts/"

function getDirectories(srcpath: string) {
  	return fs.readdirSync(srcpath).filter((file) => {
		return fs.statSync(path.join(srcpath, file)).isDirectory()
  	})
}

function tslint(targetFile: string) {
	try {
		execSync(`node ./node_modules/.bin/tslint ${targetFile}`)
  	} catch (e) {
		throw new Error(`Message: ${e.toString()}, stdout: ${e.stdout && e.stdout.toString()}, stderr: ${e.stderr && e.stderr.toString()}`)
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
