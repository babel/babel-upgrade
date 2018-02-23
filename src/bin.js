const path = require('path');
const { isAcceptedNodeVersion, writePackageJSON, writeBabelRC, writeMochaOpts, installDeps } = require('.');
const globby = require('globby');
const cwd = process.cwd();

if (!isAcceptedNodeVersion()) {
  throw new Error("Babel 7 will only support Node 4 and higher");
}

// TOOD: allow passing a specific path
(async () => {
  // account for nested babelrc's
  const paths = await globby(['**/.babelrc', '!**/node_modules/**']);
  const packages = await globby(['**/package.json', '!**/node_modules/**']);
  const mochaOpts = await globby(['**/mocha.opts', '!**/node_modules/**']);

  // if not a monorepo
  if (packages.length === 1) {
    if (paths.length > 1) {
      console.log("We suggest using the new 'overrides' option instead of nested .babelrc's, can check out http://new.babeljs.io/docs/en/next/babelrc.html#overrides");
      console.log("");
    }
    paths.forEach(p => writeBabelRC(p));
  }

  mochaOpts.forEach(p => writeMochaOpts(p));

  // TOOD: allow passing a specific path
  await writePackageJSON();

  // TODO: add smarter CLI option handling if we support more options
  if (process.argv[2] === '--install') {
    console.log('Installing new dependencies');
    await installDeps();
  }
})();
