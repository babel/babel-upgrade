# babel-upgrade

```bash
npx babel-upgrade
```

## Goals

> Update dependencies, config files, and maybe JavaScript files that require babel packages directly

> [x] Works on Node >= 4 (anything lower isn't supported in v7)
- [x] Update `package.json`: `dependencies` and `devDependencies` to the "latest supported" version. 
  - [x] all package renames
  - [x] Upgrading the same package to the latest version
  - [x] add `@babel/core` peerDep
  - [x] modify scripts for mocha + `@babel/register`
  - [x] throw/warn if engines is < node 4 or current node is < 4?
  - [x] use `"babel-core": "^7.0.0-bridge-0"` if jest is a dependency
  - [x] add new `@babel/node` package if `babel-node` is used
  - [ ] log when replacing out preset-es2015,16,17,latest as FYI
  - [ ] if `babel-node` is used, import `@babel/node`?
- [ ] Auto run npm or yarn after updating dependencies
- [ ] Update the babel config file(s).
  - [x] `.babelrc`
  - [ ] `.babelrc.js` and other js files with a config like presets, `webpack.config.js`
  - [x] `package.json babel key`
  - [x] handle `env`
  - [x] handle shorthand names: `babel-preset-env` and `env`
  - [ ] convert comma separated presets/plugins into an array
  - [ ] handle react + flow preset being split. Read if `.flowconfig` and add it?
  - [ ] convert only/ignore?
  - [ ] how do we want to handle spec/loose modes, especially when changing previous loose mode to spec (just warn?)
  - [ ] remove `typeof-symbol` if using `@babel/preset-env`
- [ ] Update test files that use babel directly (`babel-types`, `babel-core`)
  - Update all requires/imports
  - Update the use of the Babel API (plugins, integrations)
- [ ] Modify misc files as we go (`karma.conf.js`, `mocha.opts`)
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
