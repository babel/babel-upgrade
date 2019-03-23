# babel-upgrade

> A tool that tries to automatically update most dependencies, config files, and JavaScript files that require Babel packages directly to [Babel 7](http://babeljs.io/docs/en/v7-migration.html) (and more in the future).

## Usage

**Requires nodejs 8 or newer**

Run at the root of your git repo:

> If using npm < v5.2.0, install [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) globally.

```bash
# npx lets you run babel-upgrade without installing it locally
npx babel-upgrade --write

# or install globally and run
npm install babel-upgrade -g
babel-upgrade --write
```

Without the `--write` (or `-w`) flag, `babel-upgrade` will print a diff without writing any changes.

Optionally, add `--install` (or `-i`) as well to run `yarn` or `npm` after writing the upgrade.

```bash
npx babel-upgrade --write --install
```

> Ideas from http://new.babeljs.io/docs/en/next/v7-migration.html (or modify that file if it's missing)

## Todos

- [x] Works on Node >= 8 (anything lower isn't supported in v7) ([#16](https://github.com/babel/babel-upgrade/pull/16))
- [x] Run npm/yarn after updating dependencies (use `--install`) ([#18](https://github.com/babel/babel-upgrade/pull/18))
- [x] Update `package.json`: `dependencies` and `devDependencies` to the "latest supported" version.
  - [x] all package renames
    - [x] `babel-loader` for webpack >=1 ([#34](https://github.com/babel/babel-upgrade/pull/34))
    - [x] `rollup-plugin-babel` ([#36](https://github.com/babel/babel-upgrade/pull/36))
  - [x] Upgrading the same package to the latest version
  - [x] add `@babel/core` peerDep ([7c34cd](https://github.com/babel/babel-upgrade/commit/7c34cdf318ecbb8a916e7a8ee5c2cfbad7d8d8d0))

```diff
{
  "devDependencies": {
+   "@babel/core": "^7.0.0",
+   "@babel/plugin-proposal-object-rest-spread": "^7.0.0",
+   "@babel/preset-env": "^7.0.0",
+   "babel-loader": "v8.0.0-beta.0"
-   "babel-loader": "6.0.0",
-   "babel-plugin-transform-object-rest-spread": "6.0.0",
-   "babel-preset-env": "^1.0.0",
  },
}
```

- [x] modify scripts for mocha + `@babel/register` ([e81cf7](https://github.com/babel/babel-upgrade/commit/e81cf7c16860d424967a254cd700a88c33d2b56a))

```diff
{
  "name": "mocha-scripts-test",
  "scripts": {
-    "test": "mocha --compilers js:babel-register --require babel-polyfill test/*Test.js",
+    "test": "mocha --compilers js:@babel/register --require @babel/polyfill test/*Test.js",
  }
}
```

- [x] use `"babel-core": "^7.0.0-bridge-0"` if jest or jest-cli is a dependency ([#14](https://github.com/babel/babel-upgrade/pull/14))

```diff
"devDependencies": {
  "@babel/core": "^7.0.0",
+ "babel-core": "7.0.0-bridge.0",
  "jest": "^22.0.0"
},
"scripts": {
  "test": "jest"
}
```

- [x] add new `@babel/node` package if `babel-node` is used ([#14](https://github.com/babel/babel-upgrade/pull/14))

```diff
"devDependencies": {
  "@babel/cli": "^7.0.0",
+ "@babel/node": "^7.0.0"
},
"scripts": {
  "start": "babel-node a.js"
}
```


- [x] Handle all nested `.babelrc` ([#14](https://github.com/babel/babel-upgrade/pull/14))

```txt
- src/
- example/
  - .babelrc // now modifies these too
- test/
  - .babelrc // now modifies these too
- `.babelrc`
```
- [x] rename config files to swap shorthand form to long form

```diff
{
  "presets": [
+   "@babel/preset-env"
-   "env"
  ]
}
```

- [x] `package.json babel key` ([d123ad](https://github.com/babel/babel-upgrade/commit/d123ad72fba25c9118847b36ae950d99c1a152d0))

```diff
{
  "babel": {
    "presets": [
+     "@babel/preset-env"
-     "env"
    ]
  }
}
```

- [x] handle `env` ([e9fc42](https://github.com/babel/babel-upgrade/commit/e9fc42203d6c5928d85c12438efa42398d2d6a2a))

```diff
{
  "babel": {
    "presets": [
      "@babel/preset-env"
    ]
  },
  "env": {
    "development": {
      "plugins": [
-       "transform-react-jsx-source",
-       "babel-plugin-transform-react-jsx-self"
+       "@babel/plugin-transform-react-jsx-source",
+       "@babel/plugin-transform-react-jsx-self",
      ]
    }
  }
}


```
- [x] Modify `mocha.opts` ([e81cf7](https://github.com/babel/babel-upgrade/commit/e81cf7c16860d424967a254cd700a88c33d2b56a))

```diff
---require babel-register
+--require @babel/register
```

- [x] Convert comma separated presets/plugins into an array ([#37](https://github.com/babel/babel-upgrade/pull/37))

```diff
{
-  "presets": "env, react",
+  "presets": ["@babel/preset-env", "@babel/preset-react"],
```

- [x] handle react + flow preset being split. Read if `.flowconfig` and add it? ([#21](https://github.com/babel/babel-upgrade/pull/21))

```diff
{
  "@babel/preset-react": "^7.0.0",
+  "@babel/preset-flow": "^7.0.0"
}
```
- [x] Replace Stage presets with individual proposal plugins ([#69](https://github.com/babel/babel-upgrade/pull/69))

```diff
{
-  "presets": ["@babel/preset-stage-3"],
+  "presets": [],
+  "plugins": [
+    "@babel/plugin-syntax-dynamic-import",
+    "@babel/plugin-syntax-import-meta",
+    "@babel/plugin-proposal-class-properties",
+    "@babel/plugin-proposal-json-strings"
+  ]
}
```

```diff
{
-    "@babel/preset-stage-3": "^7.0.0"
+    "@babel/plugin-proposal-class-properties": "^7.0.0",
+    "@babel/plugin-proposal-json-strings": "^7.0.0",
+    "@babel/plugin-syntax-dynamic-import": "^7.0.0",
+    "@babel/plugin-syntax-import-meta": "^7.0.0"
}
```

- [ ] Log when replacing out preset-es2015,16,17,latest as FYI
- [ ] Figure out how to change nested .babelrcs into using "overrides" instead
- [ ] Monorepo support
- [ ] `.babelrc.js` and other js files with a config like presets, `webpack.config.js`
- [ ] convert `only`/`ignore` if necessary
- [ ] remove `typeof-symbol` if using `@babel/preset-env` + loose
- [ ] Update test files that use babel directly (`babel-types` -> `@babel/types`, `babel-core`)
  - [ ] Update all requires/imports
  - [ ] Update the use of the Babel API (plugins, integrations)
- [ ] Modify other config files as we go
- [ ] Add to the upgrade guide which parts are autofixable and the command (if we care enough to make this individually runnable too infrastructure wise)
- [ ] May need to add a warning on any 3rd party plugins since they might not be compatible
- [ ] Handle the differences in plugins in v7 for default/loose/spec
- [ ] Should certain parts be generic (replace the string `babel-register` with `@babel/register`)? Could be in a Makefile or somewhere else, but it's just find replace.

## Philosophy

- Move this into the monorepo when somewhat ready
  - Maybe move into `@babel/cli`?
  - Or just another package that is intended to be used via `npx/globally`
- Whenever there is a breaking change in a PR we should also update this tool when possible or at least provide a warning
  - What about with a regression?
- Can be used for non-major bumps too - just for updating to the latest version.
- Include mini-changelog?
- Maybe the version should just reflect the version that it targets?

## Development
```Shell
npm install
npm start
```
