const path = require('path');
const readPkgUp = require('read-pkg-up');
const sortKeys = require('sort-keys');
const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');

const upgradeDeps = require('./upgradeDeps');
const upgradeConfig = require('./upgradeConfig');

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
  if (pkg.devDependencies) {
    pkg.devDependencies = sortKeys(upgradeDeps(
      pkg.devDependencies,
      getLatestVersion()
    ));
  }

  if (pkg.dependencies) {
    pkg.dependencies = sortKeys(upgradeDeps(
      pkg.dependencies,
      getLatestVersion()
    ));
  }

  if (pkg.scripts) {
    pkg.scripts = upgradeScripts(pkg.scripts);
  }

  return pkg;
}

async function writePackageJSON() {
  let { pkg, path } = await readPkgUp({ normalize: false });

  pkg = updatePackageJSON(pkg);

  await writeJsonFile(path, pkg, { detectIndent: true });
}

function updateBabelRC(config) {
  return upgradeConfig(config);
}

async function writeBabelRC(configPath) {
  let json;

  try {
    json = await loadJsonFile(configPath);
  } catch (e) {
    throw new Error(`babel-upgrade: ${configPath} does not contain a .babelrc file`);
  }

  json = updateBabelRC(json);

  await writeJsonFile(configPath, json, { detectIndent: true });
}

module.exports = {
  updatePackageJSON,
  writePackageJSON,
  writeBabelRC,
  getLatestVersion
};
