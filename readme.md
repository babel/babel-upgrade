# babel-upgrade

## Usage

Run at the root of your git repo

```bash
npx babel-upgrade
```

Optionally use `--install` to run `yarn` or `npm` after the upgrade.

```bash
npx babel-upgrade --install
```

> Ideas from http://new.babeljs.io/docs/en/next/v7-migration.html (or modify that file if it's missing)

## Todos

> Update dependencies, config files, and maybe JavaScript files that require babel packages directly

- [x] Works on Node >= 4 (anything lower isn't supported in v7)
- [x] Update `package.json`: `dependencies` and `devDependencies` to the "latest supported" version.
  - [x] all package renames
  - [x] Upgrading the same package to the latest version
  - [x] add `@babel/core` peerDep

```diff
{
  "devDependencies": {
+   "@babel/core": "7.0.0-beta.39",
+   "@babel/plugin-proposal-object-rest-spread": "7.0.0-beta.39",
+   "@babel/preset-env": "7.0.0-beta.39",
+   "babel-loader": "v8.0.0-beta.0"
-   "babel-loader": "6.0.0",
-   "babel-plugin-transform-object-rest-spread": "6.0.0",
-   "babel-preset-env": "^1.0.0",
  },
}
```

- [x] modify scripts for mocha + `@babel/register`

```diff
{
  "name": "mocha-scripts-test",
  "scripts": {
-    "test": "mocha --compilers js:babel-register --require babel-polyfill test/*Test.js",
+    "test": "mocha --compilers js:@babel/register --require @babel/polyfill test/*Test.js",
  }
}
```

- [x] use `"babel-core": "^7.0.0-bridge-0"` if jest is a dependency

```diff
"devDependencies": {
  "@babel/core": "7.0.0-beta.39",
+ "babel-core": "7.0.0-bridge.0",
  "jest": "^22.0.0"
},
"scripts": {
  "test": "jest"
}
```

- [x] add new `@babel/node` package if `babel-node` is used

```diff
"devDependencies": {
  "@babel/cli": "7.0.0-beta.39",
+ "@babel/node": "7.0.0-beta.39"
},
"scripts": {
  "start": "babel-node a.js"
}
```

- [x] if `babel-node` is used, import `@babel/node`?

```diff
{
  "devDependencies": {
+   "@babel/node": "7.0.0-beta.39"
  }
  "scripts": {
    "start": "babel-node"
  }
}
```

- [x] Update the babel config file(s).
  - [x] change all `.babelrc` files

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

- [x] `package.json babel key`

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

- [x] handle `env`

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
- [x] Modify `mocha.opts`
- [ ] Log when replacing out preset-es2015,16,17,latest as FYI
- [x] ~~Auto~~ Run npm/yarn after updating dependencies (use `--install`)
- [ ] Figure out how to change nested .babelrcs into using "overrides" instead
- [ ] Monorepo support
- [ ] `.babelrc.js` and other js files with a config like presets, `webpack.config.js`
- [ ] Convert comma separated presets/plugins into an array
- [x] handle react + flow preset being split. Read if `.flowconfig` and add it?
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
```sh
$ npm i
$ npm start
```
