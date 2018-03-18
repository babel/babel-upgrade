const semver = require('semver');
const { getNewPackageName, latestPackages } = require('./packageData');

const otherPackages = {
  'babel-loader': '^8.0.0-beta.0',
  'rollup-plugin-babel': '^4.0.0-beta.2',
};

module.exports = function upgradeDeps(dependencies, version, options = {}) {
  for (const pkg of Object.keys(dependencies)) {
    const depVersion = dependencies[pkg];

    const newPackageName = getNewPackageName(pkg);
    if (newPackageName !== undefined) {
      // don't update `babel-core` bridge
      if (dependencies[pkg].includes("7.0.0-bridge.0")) {
        break;
      }

      delete dependencies[pkg];

      if (newPackageName) {
        if (process.env.DEBUG) {
          console.warn(`Updating ${pkg} -> ${newPackageName}`);
        }
        if (Array.isArray(newPackageName)) {
          for (name of newPackageName) {
            dependencies[name] = version;
          }
        } else {
          dependencies[newPackageName] = version;
        }
      }
    } else if (
      latestPackages.has(pkg) &&
      semver.valid(depVersion) &&
      semver.valid(version) &&
      semver.lt(depVersion, version)
    ) {
      dependencies[pkg] = version;
    // TODO: refactor out somewhere else
    } else if (otherPackages[pkg]) {
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

  // Adds preset-flow if needed, especially since it was split out of
  // preset-react
  if (options.hasFlow && !dependencies['@babel/preset-flow']) {
    dependencies['@babel/preset-flow'] = version;
  }

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
    (dependencies['jest'] || (depsWebpack1 && dependencies['babel-loader'])) &&
    !dependencies['babel-core']
  ) {
    dependencies['babel-core'] = '^7.0.0-bridge.0';
  }

  return dependencies;
}
