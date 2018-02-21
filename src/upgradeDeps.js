const semver = require('semver');
const { packages: oldPackages, latestPackages } = require('./packageData');

const otherPackages = {
  'babel-loader': 'v8.0.0-beta.0',
};

module.exports = function upgradeDeps(dependencies, version, options = {}) {
  const { hasFlow } = options;

  for (let pkg of Object.keys(dependencies)) {
    const depVersion = dependencies[pkg];
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
      a.startsWith('@babel/plugin') || a.startsWith('@babel/preset'))
  ) {
    dependencies['@babel/core'] = version;
  }

  // Adds preset-flow if needed, especially since it was split out of
  // preset-react
  if (hasFlow && !dependencies['@babel/preset-flow']) {
    dependencies['@babel/preset-flow'] = version;
  }

  return dependencies;
}
