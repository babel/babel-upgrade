const { packages: oldPackages, latestPackages } = require('./packageData');

function upgradeDeps(dependencies, version) {
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
    }
  }
  return dependencies;
}

module.exports = upgradeDeps;
