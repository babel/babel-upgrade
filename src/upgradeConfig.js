const { presets: oldPresets, plugins: oldPlugins, pluginsNowSpecByDefault } = require('./packageData');

const unhandledPluginsNowSpecByDefault = new Set(pluginsNowSpecByDefault);

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
      if (Array.isArray(preset)) {
        if (preset[0].indexOf('babel-preset') !== 0 && preset[0].indexOf('@babel/') !== 0) {
          preset[0] = `babel-preset-${preset[0]}`;
        }
        if (presetsToReplace.includes(preset[0])) {
          if (oldPresets[preset[0]]) {
            preset[0] = oldPresets[preset[0]];
          } else {
            presets.splice(i, 1);
            i--;
          }
        }
      } else {
        if (preset.indexOf('babel-preset') !== 0 && preset.indexOf('@babel/') !== 0) {
          preset = `babel-preset-${preset}`;
        }
        if (presetsToReplace.includes(preset)) {
          if (oldPresets[preset]) {
            presets[i] = oldPresets[preset];
          } else {
            presets.splice(i, 1);
            i--;
          }
        }
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
      const pluginsToReplace = Object.keys(oldPlugins);

      // check if it's a plugin with options (an array)
      if (Array.isArray(plugin)) {

        if (plugin[0].indexOf('babel-plugin') !== 0 && plugin[0].indexOf('@babel/') !== 0) {
          plugin[0] = `babel-plugin-${plugin[0]}`;
        }

        if (pluginsToReplace.includes(plugin[0])) {
          if (oldPlugins[plugin[0]]) {
            plugins[i] = setLooseIfNeeded([oldPlugins[plugin[0]], plugin[1]]);
          } else {
            plugins.splice(i, 1);
            i--;
          }
        }
      } else {
        if (plugin.indexOf('babel-plugin') !== 0 && plugin.indexOf('@babel/') !== 0) {
          plugin = `babel-plugin-${plugin}`;
        }
        if (pluginsToReplace.includes(plugin)) {
          if (oldPlugins[plugin]) {
            plugins[i] = setLooseIfNeeded(oldPlugins[plugin]);
          } else {
            plugins.splice(i, 1);
            i--;
          }
        }
      }
    }
  }
}

function buildPluginGithubUrl(plugin) {
  return `https://github.com/babel/babel/tree/master/packages/${plugin.replace('@', '').replace('/', '-')}`;
}

function setLooseIfNeeded(plugin) {
  if (Array.isArray(plugin)) {
    if (pluginsNowSpecByDefault.has(plugin[0])) {
      plugin[1] = plugin[1] || {};
      if (!plugin[1].spec) {
        Object.assign(plugin[1], { loose: true });
      }
      delete plugin[1].spec;
    }
    unhandledPluginsNowSpecByDefault.delete(plugin[0]);
    return Object.keys(plugin[1]).length > 0 ? plugin : plugin[0];
  } else {
    if (pluginsNowSpecByDefault.has(plugin)) {
      plugin = [plugin, { loose: true }];
    }
    unhandledPluginsNowSpecByDefault.delete(plugin);
    return plugin;
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

  unhandledPluginsNowSpecByDefault.forEach(plugin => {
    console.log(`\`${plugin}\` is now spec by default. For parity with Babel 6, use the \`loose\` flag (${buildPluginGithubUrl(plugin).concat('#loose')})`)
  });

  return config;
};
