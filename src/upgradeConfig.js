const { presets: oldPresets, plugins: oldPlugins } = require('./packageData');

module.exports = function upgradeConfig(config) {
  config = Object.assign({}, config);

  const presets = config.presets;

  // check if presets are there
  if (presets) {
    // assume it's an array
    for (let i = 0; i < presets.length; i++) {
      let preset = presets[i];
      const presetsToReplace = Object.keys(oldPresets).map(p => p.replace('babel-preset-', ''));

      // check if it's a preset with options (an array)
      if (Array.isArray(preset)) {
        if (presetsToReplace.includes(preset[0])) {
          preset[0] = oldPresets[`babel-preset-${preset[0]}`];
        }
      } else {
        // should be a string now
        if (presetsToReplace.includes(preset)) {
          presets[i] = oldPresets[`babel-preset-${preset}`];
        }
      }
    }
  }

  const plugins = config.plugins;

  // check if plugins are there
  if (plugins) {
    // assume it's an array
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i];
      const pluginsToReplace = Object.keys(oldPlugins).map(p => p.replace('babel-plugin-', ''));

      // check if it's a plugin with options (an array)
      if (Array.isArray(plugin)) {
        if (pluginsToReplace.includes(plugin[0])) {
          plugin[0] = oldPlugins[`babel-plugin-${plugin[0]}`];
        }
      } else {
        // should be a string now
        if (pluginsToReplace.includes(plugin)) {
         plugins[i] = oldPlugins[`babel-plugin-${plugin}`];
        }
      }
    }
  }

  return config;
};
