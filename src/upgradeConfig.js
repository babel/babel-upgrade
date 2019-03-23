const { presets: oldPresets, plugins: oldPlugins, stagePresets } = require('./packageData');
const upgradeOptions = require('./upgradeOptions');

function changeName(originalName, kind) {
  const oldNames = kind === 'plugin' ? oldPlugins : oldPresets;
  let name = originalName;

  if (name.indexOf(`babel-${kind}`) !== 0 && name.indexOf('@babel/') !== 0 && name.indexOf('module:ava') !== 0) {
    name = `babel-${kind}-${name}`;
  }

  if (oldNames.hasOwnProperty(name)) {
    if (oldNames[name]) {
      return oldNames[name];
    } else {
      return null;
    }
  }

  return originalName;
}

// TODO: fix all of this
function changePresets(config, options = {}) {
  let presets = config.presets;
  const newPlugins = [];

  if (!Array.isArray(presets) && typeof presets === 'string') {
    presets = config.presets = config.presets.split(',').map((preset) => preset.trim());
  }

  // check if presets are there
  if (presets) {
    // assume it's an array
    for (let i = 0; i < presets.length; i++) {
      let preset = presets[i];
      const presetsToReplace = Object.keys(oldPresets);

      // check if it's a preset with options (an array)
      const isArray = Array.isArray(preset);

      const name = changeName(isArray ? preset[0] : preset, 'preset');
      if (name === null || name.startsWith('@babel/preset-stage-')) {
        presets.splice(i, 1);
        i--;

        if (name !== null) {
          const stage = name.slice(-1);
          newPlugins.push(stagePresets[stage]);
        }
      } else {
        if (isArray) preset[0] = name;
        else preset = name;

        presets[i] = upgradeOptions(preset);
      }
    }

    if (options.hasFlow && !presets.includes('@babel/preset-flow')) {
      presets.push('@babel/preset-flow');
    }

    if (newPlugins.length > 0) {
      config.plugins = (config.plugins || []).concat(...newPlugins);
    }
  }
}

function changePlugins(config, options = {}) {
  let plugins = config.plugins;
  const uniquePlugins = new Set();

  if (!Array.isArray(plugins) && typeof plugins === 'string') {
    plugins = config.plugins = config.plugins.split(',').map((plugin) => plugin.trim());
  }

  // check if plugins are there
  if (plugins) {
    // assume it's an array
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i];

      // check if it's a plugin with options (an array)
      const isArray = Array.isArray(plugin);
      const oldName = isArray ? plugin[0] : plugin;

      const name = changeName(oldName, 'plugin');

      if (name === null) {
        plugins.splice(i, 1);
        i--;
      } else {
        const names = Array.isArray(name) ? name : [name];
        for (let j = 0; j < names.length; j++) {
          const n = names[j];
          if (uniquePlugins.has(n)) {
            if (j === 0) {
              plugins.splice(i, 1);
              i--;
            }
            continue;
          }
          uniquePlugins.add(n);

          const shouldAddCoreJS = oldName === "babel-plugin-transform-runtime" || oldName === "transform-runtime";
          if (
            oldName === "@babel/plugin-transform-runtime" ||
            oldName === "@babel/transform-runtime"
          ) {
            // 7.0.0-alpha.5 <= x <= 7.0.0-beta.55
            console.warn(
              "Babel was not able to dedice whether or not to add a "
              + "`corejs: 2` option to @babel/plugin-transform-rumtime. "
              + "If you want it to handle builtin functions (e.g. Promise, "
              + "Array.prototype.includes, ...), add that option manually:\n"
              + "\t[\"@babel/plugin-transform-runtime\", { \"corejs\": 2 }]\n"
            );
          }

          if (shouldAddCoreJS) {
            if (isArray) {
              plugin[0] = n;
              plugin[1] = Object.assign({ corejs: 2 }, plugin[1]);
            } else {
              plugin = [n, { corejs: 2 }];
            }
          } else {
            if (isArray) plugin = [n, plugin[1]];
            else plugin = n;
          }

          if (j > 0) {
            plugins.splice(i + 1, 0, upgradeOptions(plugin));
            i++;
          }
          else plugins[i] = upgradeOptions(plugin);
        }
      }
    }
  }
}

module.exports = function upgradeConfig(config, options) {
  config = Object.assign({}, config);

  changePresets(config, options);
  changePlugins(config, options);

  if (config.env) {
    Object.keys(config.env).forEach((env) => {
      changePresets(config.env[env]);
      changePlugins(config.env[env], options);
    });
  }

  return config;
};
