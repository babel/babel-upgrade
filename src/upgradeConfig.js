const { presets: oldPresets, plugins: oldPlugins } = require('./packageData');

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
      if (name === null) {
        presets.splice(i, 1);
        i--;
      } else {
        if (isArray) preset[0] = name;
        else presets[i] = name;
      }
    }

    if (options.hasFlow && !presets.includes('@babel/preset-flow')) {
      presets.push('@babel/preset-flow');
    }
  }
}

function changePlugins(config) {
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
      if (name === null) {
        plugins.splice(i, 1);
        i--;
      } else {
        if (isArray) plugin[0] = name;
        else plugins[i] = name;
      }
    }
  }
}

module.exports = function upgradeConfig(config, options) {
  config = Object.assign({}, config);

  changePresets(config, options);
  changePlugins(config);

  if (config.env) {
    Object.keys(config.env).forEach((env) => {
      changePresets(config.env[env]);
      changePlugins(config.env[env]);
    });
  }

  return config;
};
