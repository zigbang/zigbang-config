# @zigbang/config
> Sharable configs for for all **Zigbang** projects

- [About](#about)
- [Install](#install)
- [tsconfig](#1-tsconfig)
- [tslint](#2-tslint)

## About

// TODO

## Install
```
$ yarn add @zigbang/config
```

## 1. tsconfig
Add the typescript config file tsconfig.json:
```json
{
    "extends": "./node_modules/@zigbang/tsconfig.base.json"
}
```

## 2. tslint

Add the TSLint config file tslint.json:
```json
{
    "extends": [
        "@zigbang/tslint.base.json"
    ]
}
```