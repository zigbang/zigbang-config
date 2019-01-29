# @zigbang/config
> Sharable configs for for all **Zigbang** projects

- [About](#about)
- [Install](#install)
- [@zigbang/config-tsconfig](#1-zigbangconfig-tsconfig)
- [@zigbang/config-tslint](#2-zigbangconfig-tslint)
- [@zigbang/config-prettier](#3-zigbangconfig-prettier)
- [Using tslint + prettier](#using-tslint--prettier)

## About

// TODO

## Install
```
$ yarn add @zigbang/config
```

## 1. @zigbang/config-tsconfig
Add the typescript config file tsconfig.json:
```json
{
    "extends": "./node_modules/@zigbang/config-tsconfig/tsconfig"
}
```

## 2. @zigbang/config-tslint

Add the TSLint config file tslint.json:
```json
{
    "extends": [
        "@zigbang/config-tslint/tslint.json"
    ]
}
```

## 3. @zigbang/config-prettier
Add the prettier config file `prettier.config.js`:
```js
module.exports = {
  ...require("@zigbang/config-prettier/prettier.js"),
  // customized options
};
```


## Using tslint + prettier

Add a following script in your `package.json`:
```json
{
    "scripts": {
        "lint": "prettier --write ./{your_source_directory}/*.{ts,tsx} --config ./prettier.config.js && tslint --project ."
    }
}
```
