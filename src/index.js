const path = require('path');
const readPkgUp = require('read-pkg-up');
const sortKeys = require('sort-keys');
const fs = require('fs');
const pify = require('pify');
const JSON5 = require('json5');
const writeJsonFile = require('write-json-file');
const semver = require('semver');

const upgradeDeps = require('./upgradeDeps');
const upgradeConfig = require('./upgradeConfig');

function isAcceptedNodeVersion() {
  return semver.satisfies(process.version, '>= 4');
}

function getLatestVersion() {
  return "7.0.0-beta.39";
}

function upgradeScripts(scripts) {
  for (let script of Object.keys(scripts)) {
    // mocha --compilers js:@babel/register
    scripts[script] = scripts[script].replace('--compilers js:babel-register', '--compilers js:@babel/register');
    scripts[script] = scripts[script].replace('--require babel-register', '--require @babel/register');
  }
  return scripts;
}

function updatePackageJSON(pkg) {
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
    pkg.devDependencies = upgradeDeps(
      pkg.devDependencies,
      getLatestVersion()
    );

    const devDeps = Object.keys(pkg.devDependencies);
    // use babel-bridge for jest
    // maybe should do this for other tools?
    if (devDeps.includes("jest") && !devDeps.includes("babel-core")) {
      pkg.devDependencies["babel-core"] = "^7.0.0-bridge.0";
    }

    pkg.devDependencies = sortKeys(pkg.devDependencies);
  }

  if (pkg.dependencies) {
    pkg.dependencies = sortKeys(upgradeDeps(
      pkg.dependencies,
      getLatestVersion()
    ));
  }

  return pkg;
}

async function writePackageJSON() {
  let { pkg, path } = await readPkgUp({ normalize: false });

  pkg = updatePackageJSON(pkg);

  if (pkg.babel) {
    console.log("Updating package.json 'babel' config");
    pkg.babel = upgradeConfig(pkg.babel);
  }

  await writeJsonFile(path, pkg, { detectIndent: true });
}

async function readBabelRC(configPath) {
  try {
    const rawFile = (await pify(fs.readFile)(configPath)).toString('utf8');
    return JSON5.parse(rawFile);
  } catch (e) {
    throw new Error(`babel-upgrade: ${configPath} does not contain a valid .babelrc file. ${e.stack}`);
  }
}

async function writeBabelRC(configPath) {
  let json;

  try {
    json = await readBabelRC(configPath);
  } catch (e) {}

  if (json) {
    console.log(`Updating .babelrc config at ${configPath}`);
    json = upgradeConfig(json);
    await writeJsonFile(configPath, json, { detectIndent: true });
  }
}

module.exports = {
  isAcceptedNodeVersion,
  updatePackageJSON,
  writePackageJSON,
  readBabelRC,
  writeBabelRC,
  getLatestVersion
};
