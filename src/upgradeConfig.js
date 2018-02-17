const { presets: oldPresets, plugins: oldPlugins } = require('./packageData');

function changePresets(config) {
  const presets = config.presets;

  // check if presets are there
  if (presets) {
    // assume it's an array
    for (let i = 0; i < presets.length; i++) {
      let preset = presets[i];
      const presetsToReplace = Object.keys(oldPresets);

      // check if it's a preset with options (an array)
      if (Array.isArray(preset)) {
        if (preset[0].indexOf('babel-preset') !== 0) {
          preset[0] = `babel-preset-${preset[0]}`;
        }
        if (presetsToReplace.includes(preset[0])) {
          preset[0] = oldPresets[preset[0]];
        }
      } else {
        if (preset.indexOf('babel-preset') !== 0) {
          preset = `babel-preset-${preset}`;
        }
        if (presetsToReplace.includes(preset)) {
          presets[i] = oldPresets[preset];
        }
      }
    }
  }
}

function changePlugins(config) {
  const plugins = config.plugins;

  // check if plugins are there
  if (plugins) {
    // assume it's an array
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i];
      const pluginsToReplace = Object.keys(oldPlugins);

      // check if it's a plugin with options (an array)
      if (Array.isArray(plugin)) {
        if (plugin[0].indexOf('babel-plugin') !== 0) {
          plugin[0] = `babel-plugin-${plugin[0]}`;
        }
        if (pluginsToReplace.includes(plugin[0])) {
          plugin[0] = oldPlugins[plugin[0]];
        }
      } else {
        if (plugin.indexOf('babel-plugin') !== 0) {
          plugin = `babel-plugin-${plugin}`;
        }
        if (pluginsToReplace.includes(plugin)) {
          plugins[i] = oldPlugins[plugin];
        }
      }
    }
  }
}

module.exports = function upgradeConfig(config) {
  config = Object.assign({}, config);

  changePresets(config);
  changePlugins(config);

  if (config.env) {
    Object.keys(config.env).forEach((env) => {
      changePresets(config.env[env]);
      changePlugins(config.env[env]);
    });
  }

  return config;
};
