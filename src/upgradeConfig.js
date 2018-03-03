const { presets: oldPresets, plugins: oldPlugins } = require('./packageData');

function transformPresets(presets, options = {}) {
  if (!Array.isArray(presets) && typeof presets === 'string') {
    presets = presets.split(',').map(preset => preset.trim());
  }

  if (presets) {
    const newPresets = presets.map(transformPreset).filter(Boolean);

    return options.hasFlow ? appendFlowIfNeeded(newPresets) : newPresets;
  }

  return presets;
}

function appendFlowIfNeeded(presets) {
  return presets.find(preset => preset === '@babel/preset-flow' || preset[0] === '@babel/preset-flow')
    ? presets
    : presets.concat(['@babel/preset-flow']);
}

function transformPreset(preset) {
  let presetName = Array.isArray(preset) ? preset[0] : preset;
  const presetOptions = Array.isArray(preset) ? preset[1] : {};

  if (presetName.indexOf('babel-preset') !== 0 && presetName.indexOf('@babel/') !== 0) {
    presetName = `babel-preset-${presetName}`;
  }

  const newPresetName = oldPresets[presetName];
  if (newPresetName !== undefined) {
    return Object.keys(presetOptions).length > 0 ? [newPresetName, presetOptions] : newPresetName;
  }

  return preset;
}

function transformPlugins(plugins) {
  if (!Array.isArray(plugins) && typeof plugins === 'string') {
    plugins = plugins.split(',').map(plugin => plugin.trim());
  }

  return plugins && plugins.map(transformPlugin).filter(Boolean);
}

function transformPlugin(plugin) {
  let pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
  const pluginOptions = Array.isArray(plugin) ? plugin[1] : {};

  if (pluginName.indexOf('babel-plugin') !== 0 && pluginName.indexOf('@babel/') !== 0) {
    pluginName = `babel-plugin-${pluginName}`;
  }

  const newPluginName = oldPlugins[pluginName];
  if (newPluginName !== undefined) {
    return Object.keys(pluginOptions).length > 0 ? [newPluginName, pluginOptions] : newPluginName;
  }

  return plugin;
}

module.exports = function upgradeConfig(config, options) {
  config = Object.assign({}, config);

  if (config.presets) {
    config.presets = transformPresets(config.presets, options);
  }

  if (config.plugins) {
    config.plugins = transformPlugins(config.plugins);
  }

  if (config.env) {
    Object.keys(config.env).forEach(env => {
      const envConfig = config.env[env];

      if (envConfig.presets) {
        envConfig.presets = transformPresets(envConfig.presets, options);
      }

      if (envConfig.plugins) {
        envConfig.plugins = transformPlugins(envConfig.plugins);
      }
    });
  }

  return config;
};
