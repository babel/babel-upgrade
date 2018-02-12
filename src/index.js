const path = require('path');
const readPkgUp = require('read-pkg-up');
const sortKeys = require('sort-keys');
const writeJsonFile = require('write-json-file');

const upgradeDeps = require('./upgradeDeps');

function getLatestVersion() {
  return "7.0.0-beta.39";
}

function updatePackageJSON(pkg) {
  pkg.devDependencies = sortKeys(upgradeDeps(
    pkg.devDependencies,
    getLatestVersion()
  ));

  pkg.dependencies = sortKeys(upgradeDeps(
    pkg.dependencies,
    getLatestVersion()
  ));

  return pkg;
}

async function writePackageJSON() {
  let { pkg, path } = await readPkgUp({ normalize: false });

  pkg = updatePackageJSON(pkg);

  await writeJsonFile(path, pkg, { detectIndent: true });
}

module.exports = {
  updatePackageJSON,
  writePackageJSON,
  getLatestVersion
};
