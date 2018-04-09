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

function parseOptions(args, availableOptions) {
  return Object.entries(availableOptions)
    .map(([option, flags]) => ({
      [option]: args.some(arg => flags.includes(arg))
    }))
    .reduce((options, option) => Object.assign(options, option), {});
}

// TODO: allow passing a specific path
(async () => {
  // account for nested babelrc's
  const paths = await globby(['**/.babelrc', '!**/node_modules/**']);
  const packages = await globby(['**/package.json', '!**/node_modules/**']);
  const mochaOpts = await globby(['**/mocha.opts', '!**/node_modules/**']);
  const flow = await hasFlow();
  const cliOptions = parseOptions(process.argv, {
    installDeps: ['--install'],
    write: ['--write', '-w']
  })
  const upgradeOptions = {
    hasFlow: flow,
    write: cliOptions.write
  };

  // if not a monorepo
  if (packages.length === 1) {
    if (paths.length > 1) {
      console.log("We suggest using the new 'overrides' option instead of nested .babelrc's, can check out http://new.babeljs.io/docs/en/next/babelrc.html#overrides");
      console.log("");
    }
    paths.forEach(p => writeBabelRC(p, upgradeOptions));
  }

  mochaOpts.forEach(p => writeMochaOpts(p, upgradeOptions));

  // TODO: allow passing a specific path
  await writePackageJSON(upgradeOptions);

  // TODO: add smarter CLI option handling if we support more options
  if (cliOptions.installDeps) {
    if (cliOptions.write) {
      console.log('Installing new dependencies');
      await installDeps();
    } else {
      console.log('Run babel-upgrade with --write (or) -w and --install for it to install the newly added dependencies');
    }
  }
})();
