## 1. Install
```
$ yarn add --dev @zigbang/config-prettier
```

## 2. Usage
Add the prettier config file `prettier.config.js`:
```js
module.exports = {
  ...require("@zigbang/config-prettier/prettier.js"),
  // customized options
};
```

Add script to your `package.json`:
```json
scripts: {
	"prettier": "prettier --write <your_source_path>/**/*.ts"
}
```
