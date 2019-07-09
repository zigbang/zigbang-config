"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var JSONC = __importStar(require("comment-json"));
var detect_indent_1 = __importDefault(require("detect-indent"));
var fs = __importStar(require("fs")); // TODO: shelljs
var CI_ENV_VARS = ["BUILD_BUILDID", "APPCENTER_BUILD_ID", "CODEBUILD_BUILD_ID"];
function getFile(path) {
    try {
        return fs.readFileSync(path).toString();
    }
    catch (_a) {
        return undefined;
    }
}
function writeFile(path, data) {
    fs.writeFileSync(path, data);
}
function injectZigbangTsconfig(projectRootPath) {
    var pathToTsconfig = projectRootPath + "/tsconfig.json";
    var tsconfigExtendsValue = "./node_modules/@zigbang/config/tsconfig.base.json";
    var rawTsconfig = getFile(pathToTsconfig);
    var tsconfigIndent = rawTsconfig ? detect_indent_1.default(rawTsconfig).indent : "    ";
    var tsconfig = rawTsconfig ? JSONC.parse(rawTsconfig) : undefined;
    if (!tsconfig) {
        writeFile(pathToTsconfig, JSONC.stringify({ extends: tsconfigExtendsValue }, undefined, tsconfigIndent));
    }
    else if (tsconfig && tsconfig.extends && tsconfig.extends.includes("@zigbang/config-tsconfig/")) {
        // @zigbang-config가 lerna 버전일 때의 참조를 새버전으로 변경
        tsconfig.extends = tsconfigExtendsValue;
        writeFile(pathToTsconfig, JSONC.stringify(tsconfig, undefined, tsconfigIndent));
    }
    else if (tsconfig && !tsconfig.extends) {
        tsconfig.extends = tsconfigExtendsValue;
        writeFile(pathToTsconfig, JSONC.stringify(tsconfig, undefined, tsconfigIndent));
    }
}
function injectZigbangTslint(projectRootPath) {
    var pathToTslint = projectRootPath + "/tslint.json";
    var tslintExtendsValue = "@zigbang/config/tslint.base.json";
    var rawTslint = getFile(pathToTslint);
    var tslintIndent = rawTslint ? detect_indent_1.default(rawTslint).indent : "    ";
    var tslint = rawTslint ? JSONC.parse(rawTslint) : undefined;
    if (!tslint) {
        writeFile(pathToTslint, JSONC.stringify({ extends: [tslintExtendsValue] }, undefined, tslintIndent));
    }
    else if (tslint && !tslint.extends) {
        tslint.extends = [tslintExtendsValue];
        writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent));
    }
    else if (tslint && tslint.extends && !Array.isArray(tslint.extends) && tslint.extends.includes("@zigbang/config-tslint/")) {
        // @zigbang-config가 lerna 버전일 때의 참조를 새버전으로 변경
        tslint.extends = tslintExtendsValue;
        writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent));
    }
    else if (tslint && Array.isArray(tslint.extends) && tslint.extends.some(function (extend) { return extend.includes("@zigbang/config-tslint/"); })) {
        // @zigbang-config가 lerna 버전일 때의 참조를 새버전으로 변경
        tslint.extends = tslint.extends.map(function (extend) { return extend.includes("@zigbang/config-tslint/") ? tslintExtendsValue : extend; });
        writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent));
    }
    else if (tslint && tslint.extends && !Array.isArray(tslint.extends) && tslint.extends !== tslintExtendsValue) {
        tslint.extends = [tslint.extends, tslintExtendsValue]; // The last config you list in the extends array is actually the "base" config
        writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent));
    }
    else if (tslint && Array.isArray(tslint.extends) && tslint.extends.every(function (extend) { return !extend.includes(tslintExtendsValue); })) {
        tslint.extends.push(tslintExtendsValue); // The last config you list in the extends array is actually the "base" config
        writeFile(pathToTslint, JSONC.stringify(tslint, undefined, tslintIndent));
    }
}
function injectConfigs() {
    if (isRunningOnCi())
        return;
    var PROJECT_ROOT_PATH = process.cwd() + "/../../..";
    if (!PROJECT_ROOT_PATH.includes("node_modules"))
        return; // When developing zigbang-config
    injectZigbangTsconfig(PROJECT_ROOT_PATH);
    injectZigbangTslint(PROJECT_ROOT_PATH);
}
function isRunningOnCi() {
    for (var _i = 0, CI_ENV_VARS_1 = CI_ENV_VARS; _i < CI_ENV_VARS_1.length; _i++) {
        var envVar = CI_ENV_VARS_1[_i];
        if (process.env[envVar] !== undefined)
            return true;
    }
    return false;
}
injectConfigs();
