const packageData = require('./packageData');

function parseConfigCollection(collection) {
  if (!Array.isArray(collection) && typeof collection === 'string') {
    return collection.split(',').map(collection => collection.trim());
  }

  return collection;
}

function parseConfigItem(rawConfigItem, configItemType) {
  let name = Array.isArray(rawConfigItem) ? rawConfigItem[0] : rawConfigItem;

  if (name.indexOf(`babel-${configItemType}`) !== 0 && name.indexOf('@babel/') !== 0) {
    name = `babel-${configItemType}-${name}`;
  }

  return {
    name,
    options: Array.isArray(rawConfigItem) ? rawConfigItem[1] : {}
  };
}

function formatConfigItem(item) {
  return Object.keys(item.options).length > 0 ? [item.name, item.options] : item.name;
}

const buildConfigItemTransformer = configItemType => configItem => {
  const newConfigItem = parseConfigItem(configItem, configItemType);

  const newName = packageData[`${configItemType}s`][newConfigItem.name];
  if (newName !== undefined) {
    return formatConfigItem(Object.assign(newConfigItem, { name: newName }));
  }

  return configItem;
};

function buildConfigCollectionTransformer(configItemType) {
  const itemTransformer = buildConfigItemTransformer(configItemType);
  return function(configItems) {
    configItems = parseConfigCollection(configItems);

    return configItems && configItems.map(itemTransformer).filter(Boolean);
  };
}

const transformPresets = buildConfigCollectionTransformer('preset');
const transformPlugins = buildConfigCollectionTransformer('plugin');

function appendFlowIfNeeded(presets) {
  return presets.find(preset => preset === '@babel/preset-flow' || preset[0] === '@babel/preset-flow')
    ? presets
    : presets.concat(['@babel/preset-flow']);
}

function upgradeConfigForEnv(config, options) {
  if (config.presets) {
    config.presets = options.hasFlow
      ? appendFlowIfNeeded(transformPresets(config.presets))
      : transformPresets(config.presets);
  }

  if (config.plugins) {
    config.plugins = transformPlugins(config.plugins);
  }
}

module.exports = function upgradeConfig(config, options = {}) {
  config = Object.assign({}, config);

  upgradeConfigForEnv(config, options);

  if (config.env) {
    Object.keys(config.env).forEach(env => {
      const envConfig = config.env[env];

      upgradeConfigForEnv(envConfig, options);
    });
  }

  return config;
};
