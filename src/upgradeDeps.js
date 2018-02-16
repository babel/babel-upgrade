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
    // TODO: use semver check
    } else if (Object.keys(latestPackages).includes(pkg) && depVersion !== version) {
      dependencies[pkg] = version;
    // TODO: refactor out somewhere else
    } else if (otherPackages[pkg]) {
      dependencies[pkg] = otherPackages[pkg];
    }
  }

  // one-off on checking for `@babel/core` dep
  const deps = Object.keys(dependencies);
  if (deps.some(a => {
    return a.includes('@babel/plugin') || a.includes('@babel/preset');
  })) {
    if (!deps.includes('@babel/core')) {
      dependencies['@babel/core'] = version;
    }
  }

  return dependencies;
}
