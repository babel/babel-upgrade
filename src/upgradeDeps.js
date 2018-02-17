const semver = require('semver');
const { packages: oldPackages, latestPackages } = require('./packageData');

const otherPackages = {
  'babel-loader': 'v8.0.0-beta.0',
};

module.exports = function upgradeDeps(dependencies, version) {
  for (let pkg of Object.keys(dependencies)) {
    const depVersion = dependencies[pkg];
    if (Object.keys(oldPackages).includes(pkg)) {
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

  return dependencies;
}
