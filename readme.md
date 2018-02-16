# babel-upgrade

```bash
npx babel-upgrade
```

## Goals

> Update dependencies, config file, files that require babel directly

- [x] Update `package.json`: `dependencies` and `devDependencies` to the "latest supported" version. 
  - This includes doing all package renames
  - This includes upgrading the same package to the latest version
- [ ] Update the babel config file(s).
  - [x] `.babelrc`
  - [ ] `.babelrc.js`
  - [ ] `package.json babel key`
  - [ ] handle `env`
- [ ] Update test files that use babel directly (`babel-types`, `babel-core`)
  - Update all requires/imports
  - Update the use of the Babel API (plugins, integrations)
- [ ] Misc files as we go (`karma.conf.js`, `mocha.opts`)

## Philosophy

- Move this into the monorepo when somewhat ready
  - Maybe move into `@babel/cli`?
  - Or just another package that is intended to be used via `npx/globally`
- Whenever there is a breaking change in a PR we should also update this tool when possible or at least provide a warning
  - What about with a regression?
- Can be used for non-major bumps too - just for updating to the latest version.
- Include mini-changelog?
- Maybe the version should just reflect the version that it targets?
