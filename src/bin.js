const path = require('path');
const { isAcceptedNodeVersion, writePackageJSON, writeBabelRC, writeMochaOpts, installDeps } = require('.');
const globby = require('globby');

if (!isAcceptedNodeVersion()) {
  throw new Error("Babel 7 will only support Node 4 and higher");
}

async function hasFlow() {
  const flowConfigs = await globby(['**/.flowconfig', '!**/node_modules/**']);
  return flowConfigs.length > 0;
}

// TODO: allow passing a specific path
(async () => {
  // account for nested babelrc's
  const paths = await globby(['**/.babelrc', '!**/node_modules/**']);
  const packages = await globby(['**/package.json', '!**/node_modules/**']);
  const mochaOpts = await globby(['**/mocha.opts', '!**/node_modules/**']);
  const flow = await hasFlow();

  const upgradeOptions = {
    hasFlow: flow,
  };

  // if not a monorepo
  if (packages.length === 1) {
    if (paths.length > 1) {
      console.log("We suggest using the new 'overrides' option instead of nested .babelrc's, can check out http://new.babeljs.io/docs/en/next/babelrc.html#overrides");
      console.log("");
    }
  }

  paths.forEach(p => writeBabelRC(p, upgradeOptions));
  mochaOpts.forEach(p => writeMochaOpts(p, upgradeOptions));
  await Promise.all(packages.map(p => writePackageJSON(p, upgradeOptions)));

  // TODO: add smarter CLI option handling if we support more options
  if (process.argv[2] === '--install') {
    console.log('Installing new dependencies');
    await installDeps();
  }
})();
