const path = require('path');
const readPkgUp = require('read-pkg-up');
const sortKeys = require('sort-keys');
const fs = require('fs');
const pify = require('pify');
const JSON5 = require('json5');
const writeJsonFile = require('write-json-file');
const semver = require('semver');
const writeFile = require('write');
const crossSpawn = require('cross-spawn');
const hasYarn = require('has-yarn');
const { packages } = require('./packageData');
const diff = require('diff');
const upgradeDeps = require('./upgradeDeps');
const upgradeConfig = require('./upgradeConfig');

function isAcceptedNodeVersion() {
  return semver.satisfies(process.version, '>= 4');
}

function getLatestVersion() {
  return "^7.0.0";
}

function replaceMocha(str) {
  return str
    .replace(/--compilers\s+js:babel-core\/register/, '--compilers js:@babel/register')
    .replace(/--compilers\s+js:babel-register/, '--compilers js:@babel/register')
    .replace(/--require\s+babel-register/, '--require @babel/register')
    .replace(/--require\s+babel-polyfill/, '--require @babel/polyfill');
}

function upgradeScripts(scripts) {
  for (const script of Object.keys(scripts)) {
    scripts[script] = replaceMocha(scripts[script]);
  }
  return scripts;
}

async function updatePackageJSON(pkg, options = {}) {
  if (process.env.NODE_ENV !== 'test') {
    console.log("Updating closest package.json dependencies");
  }

  if (!pkg) {
    console.log("package.json not found");
    process.exit(1);
  }

  if (pkg.scripts) {
    pkg.scripts = upgradeScripts(pkg.scripts);

    if (Object.values(pkg.scripts).some(s => s.includes('babel-node'))) {
      if (pkg.devDependencies) {
        pkg.devDependencies["@babel/node"] = getLatestVersion();
      }
    }
  }

  if (pkg.devDependencies) {
    pkg.devDependencies = sortKeys(upgradeDeps(
      pkg.devDependencies,
      getLatestVersion(),
      options,
    ));

    // Adds preset-flow if needed, especially since it was split out of
    // preset-react
    if (options.hasFlow && !pkg.devDependencies['@babel/preset-flow']) {
      pkg.devDependencies['@babel/preset-flow'] = getLatestVersion();
    }
  }

  if (pkg.dependencies) {
    pkg.dependencies = sortKeys(upgradeDeps(
      pkg.dependencies,
      getLatestVersion(),
      options,
    ));
  }

  // ava
  if (pkg.ava) {
    if (pkg.ava.require && Array.isArray(pkg.ava.require)) {
      pkg.ava.require = pkg.ava.require.map((p) => packages[p] || p);
    }

    if (pkg.ava.babel && pkg.ava.babel.testOptions) {
      pkg.ava.babel.testOptions = upgradeConfig(pkg.ava.babel.testOptions, options);
    }
  }

  return pkg;
}

function prettyPrint(json) {
  return JSON.stringify(json, null, 2);
}

function showPatch(filename, before, after) {
  console.log(
    diff.createPatch(
      filename,
      before,
      after,
      "Before Upgrade",
      "After Upgrade"
    )
  );
  console.log("");
}

async function writePackageJSON(options) {
  let { pkg, path } = await readPkgUp({ normalize: false });
  let oldPkg = prettyPrint(pkg);
  pkg = await updatePackageJSON(pkg, options);

  if (pkg.babel) {
    console.log("Updating package.json 'babel' config");
    pkg.babel = upgradeConfig(pkg.babel, options);
  }
  showPatch(path, oldPkg, prettyPrint(pkg));

  if (options.write) {
    await writeJsonFile(path, pkg, { detectIndent: true });
  }
}

async function installDeps() {
  const command = hasYarn() ? 'yarn' : 'npm';
  const args = ['install'];
  await pify(crossSpawn)(command, args, { stdio: 'inherit' });
}

async function readBabelRC(configPath) {
  try {
    const rawFile = (await pify(fs.readFile)(configPath)).toString('utf8');
    return JSON5.parse(rawFile);
  } catch (e) {
    throw new Error(`babel-upgrade: ${configPath} does not contain a valid .babelrc file. ${e.stack}`);
  }
}

async function writeBabelRC(configPath, options) {
  let json;

  try {
    json = await readBabelRC(configPath);
  } catch (e) { }

  if (json) {
    console.log(`Updating .babelrc config at ${configPath}`);
    let oldJson = prettyPrint(json);
    json = upgradeConfig(json, options);
    showPatch(configPath, oldJson, prettyPrint(json));

    if (options.write) {
      await writeJsonFile(configPath, json, { detectIndent: true });
    };
  }
}

async function writeMochaOpts(configPath, options) {
  let rawFile = (await pify(fs.readFile)(configPath)).toString('utf8');
  showPatch(configPath, rawFile, replaceMocha(rawFile));

  if (options.write) {
    await writeFile(configPath, replaceMocha(rawFile));
  }
}

module.exports = {
  isAcceptedNodeVersion,
  updatePackageJSON,
  writePackageJSON,
  readBabelRC,
  writeBabelRC,
  getLatestVersion,
  writeMochaOpts,
  installDeps,
};
