const semver = require('semver');
const { packages: oldPackages, latestPackages, stagePresets } = require('./packageData');

const otherPackages = {
  'babel-loader': '^8.0.0',
  'rollup-plugin-babel': '^4.0.1',
  'babel-eslint': '^9.0.0',
};

const runtimeVersionsWithCoreJS = "<= 7.0.0-beta.55";

module.exports = function upgradeDeps(dependencies, version, options = {}) {
  let oldRuntimeVersion;

  for (const pkg of Object.keys(dependencies)) {
    const depVersion = dependencies[pkg];

    if (pkg === "babel-runtime" || pkg === "@babel/runtime") {
      oldRuntimeVersion = depVersion;
    }

    if (Object.keys(oldPackages).includes(pkg)) {
      // don't update `babel-core` bridge
      if (dependencies[pkg].includes("7.0.0-bridge.0")) {
        break;
      }

      delete dependencies[pkg];
      const newPackageName = oldPackages[pkg];
      if (newPackageName) {
        if (process.env.DEBUG) {
          console.warn(`Updating ${pkg} -> ${newPackageName}`);
        }
        if (Array.isArray(newPackageName)) {
          newPackageName.forEach(name => dependencies[name] = version);
        } else {
          dependencies[newPackageName] = version;
        }
      }
    } else if (
      latestPackages.has(pkg) &&
      semver.valid(depVersion) &&
      semver.validRange(version) &&
      !semver.satisfies(depVersion, version)
    ) {
      dependencies[pkg] = version;
    // TODO: refactor out somewhere else
    } else if (
      otherPackages[pkg] &&
      semver.lt(
        semver.valid(semver.coerce(dependencies[pkg])),
        semver.valid(semver.coerce(otherPackages[pkg]))
      )
    ) {
      dependencies[pkg] = otherPackages[pkg];
    }
  }

  // one-off on checking for `@babel/core` dep
  if (
    !dependencies['@babel/core'] &&
    Object.keys(dependencies).some(a =>
      a.startsWith('@babel/plugin') ||
      a.startsWith('@babel/preset') ||
      a.startsWith('babel-plugin') ||
      a.startsWith('babel-preset'))
  ) {
    dependencies['@babel/core'] = version;
  }

  const webpack = semver.coerce(dependencies.webpack);
  const depsWebpack1 = webpack && webpack.major === 1;

  // Later versions of babel-loader are incompatible with Webpack v1.
  // https://github.com/babel/babel-loader/issues/505
  if (depsWebpack1 && dependencies['babel-loader']) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Updating babel-loader to v7.1.1 as this project uses Webpack v1');
    }
    dependencies['babel-loader'] = '7.1.1';
  }

  // babel-bridge is needed for Jest, or for when a project is using Webpack v1
  // and babel-loader.
  // https://github.com/babel/babel-upgrade/issues/29
  // https://github.com/babel/babel-loader/issues/505
  if (
    (dependencies['jest'] || dependencies['jest-cli'] || (depsWebpack1 && dependencies['babel-loader'])) &&
    !dependencies['babel-core']
  ) {
    dependencies['babel-core'] = '^7.0.0-bridge.0';
  }

  if (dependencies['jest'] || dependencies['jest-cli']) {
    dependencies['babel-jest'] = '^23.4.2';
  }

  for (let stage = 0; stage <= 3; stage++) {
    if (dependencies[`@babel/preset-stage-${stage}`]) {
      delete dependencies[`@babel/preset-stage-${stage}`];
      for (const plugin of stagePresets[stage]) {
        const name = typeof plugin === "string" ? plugin : plugin[0];
        dependencies[name] = version;
      }
    }
  }

  if (
    oldRuntimeVersion &&
    semver.intersects(runtimeVersionsWithCoreJS, oldRuntimeVersion)
  ) {
    delete dependencies['@babel/runtime'];
    dependencies['@babel/runtime-corejs2'] = version;
  }

  return dependencies;
}
