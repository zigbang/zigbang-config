const gulp = require("gulp");
const execute = require("child_process").exec;
const package = require("./package.json");
const writeJsonFile = require("write-json-file");

function exec(command) {
  return new Promise(function (resolve, reject) {
    execute(command, function (err, stdout, stderr) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("[end] command -> ", command);
        resolve(stdout);
      }
    });
  });
}

function setNewNpmVersionTask(done) {
  exec("npm show @zigbang/config | grep latest").then(function (result) {
    const latestVersion = result.trim().match(/^.*\: ([^\s]+)$/)[1]
    const versions = latestVersion.split(".");
    const packageVersions = package.version.split(".");

    let newPatchVersion = parseInt(versions[2]) + 1;
    if (packageVersions[0] !== versions[0] || packageVersions[1] !== versions[1]) {
      newPatchVersion = 0
    }

    const newVersion = `${packageVersions[0]}.${packageVersions[1]}.${newPatchVersion}`
    package.version = newVersion;

    writeJsonFile("package.json", package).then(done);
  }).then((result) => { done() });
}

exports.default = gulp.task("set-new-npm-version", setNewNpmVersionTask)