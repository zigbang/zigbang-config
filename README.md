# @zigbang/config
> Sharable configs for for all Zigbang projects

### Table of Contents
- [@zigbang/config-tsconfig](#1.-@zigbang/config-tsconfig)
- [@zigbang/config-tslint](#2.-@zigbang/config-tslint)
- [@zigbang/config-prettier](#3.-@zigbang/config-prettier)

## 1. @zigbang/config-tsconfig

### 1. Install
```
$ yarn add --dev @zigbang/config-tsconfig
```

### 2. Usage
Add the typescript config file tsconfig.json:
```json
{
    "extends": "./node_modules/@zigbang/config-tsconfig/tsconfig"
}
```

## 2. @zigbang/config-tslint

### 1. Install
Intall four devDependencies
```
$ yarn add --dev @zigbang/config-tslint
```

### 2. Usage
Add the TSLint config file tslint.json:
```json
{
    "extends": [
        "@zigbang/config-tslint/tslint.json"
    ]
}
```

## 3. @zigbang/config-prettier

### 1. Install
```
$ yarn add --dev @zigbang/config-prettier
```

### 2. Usage
Add the prettier config file `prettier.config.js`:
```js
module.exports = {
  ...require("@zigbang/config-prettier/prettier.js"),
  // customized options
};
```


