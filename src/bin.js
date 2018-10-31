const globby = require('globby');
const Commander = require('commander');
const {
  isAcceptedNodeVersion, writePackageJSON, writeBabelRC, writeMochaOpts, installDeps
} = require('.');


if (!isAcceptedNodeVersion()) {
  throw new Error("Babel 7 will only support Node 4 and higher");
}

Commander
  .usage('[options]')
  .option('-w, --write',  'Write back updated configure files')
  .option('-i, --install',  'Install all the updated dependencies')
  .allowUnknownOption(false)
  .parse( process.argv );


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
    write: Commander.write
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

  if (!Commander.install) return;

  if (Commander.write) {
    console.log('Installing new dependencies');
    await installDeps();
  } else {
    console.error(
      'Run babel-upgrade with --write (or) -w and --install for it to install the newly added dependencies'
    );
    process.exit(1);
  }
})();
