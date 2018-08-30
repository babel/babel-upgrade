const { presets: oldPresets, plugins: oldPlugins, stagePresets } = require('./packageData');
const upgradeOptions = require('./upgradeOptions');

function changeName(originalName, kind) {
  const oldNames = kind === 'plugin' ? oldPlugins : oldPresets;
  let name = originalName;

  if (name.indexOf(`babel-${kind}`) !== 0 && name.indexOf('@babel/') !== 0) {
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
      config.plugins = (config.plugins || []);
    }
  }
  // We return this to prevent duplication in the next step
  return newPlugins;
}

function changePlugins(config, updatedPlugins) {
  let plugins = config.plugins;
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

      const name = changeName(isArray ? plugin[0] : plugin, 'plugin');

      let alreadyDuplicated = updatedPlugins.some(plugins =>
        plugins.includes(name)
      );

      if (name === null || alreadyDuplicated) {
        plugins.splice(i, 1);
        i--;
      } else {
        if (isArray) plugin[0] = name;
        else plugin = name;

        plugins[i] = upgradeOptions(plugin);
      }
    }
  }
  if (config.plugins) {
    config.plugins = config.plugins.concat(...updatedPlugins);
  }
}

module.exports = function upgradeConfig(config, options) {
  config = Object.assign({}, config);

  let updatedPlugins = changePresets(config, options);
  changePlugins(config, updatedPlugins);

  if (config.env) {
    Object.keys(config.env).forEach((env) => {
      let updatedPlugins = changePresets(config.env[env]);
      changePlugins(config.env[env], updatedPlugins);
    });
  }

  return config;
};
