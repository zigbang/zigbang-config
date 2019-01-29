# @zigbang/config
> Sharable configs for for all **Zigbang** projects

## Install
```
$ yarn add @zigbang/config
```

## Table of Contents
- [@zigbang/config-tsconfig](#1.-@zigbang/config-tsconfig)
- [@zigbang/config-tslint](#2.-@zigbang/config-tslint)
- [@zigbang/config-prettier](#3.-@zigbang/config-prettier)

------

## 1. @zigbang/config-tsconfig
Add the typescript config file tsconfig.json:
```json
{
    "extends": "./node_modules/@zigbang/config-tsconfig/tsconfig"
}
```

------

## 2. @zigbang/config-tslint

Add the TSLint config file tslint.json:
```json
{
    "extends": [
        "@zigbang/config-tslint/tslint.json"
    ]
}
```

------

## 3. @zigbang/config-prettier
Add the prettier config file `prettier.config.js`:
```js
module.exports = {
  ...require("@zigbang/config-prettier/prettier.js"),
  // customized options
};
```
