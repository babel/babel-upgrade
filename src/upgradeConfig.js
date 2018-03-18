const {
  getNewPackageName,
  getNewPackageOptionsTransformer
} = require('./packageData');

class ConfigItem {
  constructor(rawConfigItem, type) {
    const initialName = Array.isArray(rawConfigItem)
      ? rawConfigItem[0]
      : rawConfigItem;

    let name = initialName;

    if (!name.startsWith(`babel-${type}`) && !name.startsWith('@babel/')) {
      name = `babel-${type}-${name}`;
    }

    const options =
      (Array.isArray(rawConfigItem) ? rawConfigItem[1] : {}) || {};

    const newName = getNewPackageName(name);
    const newOptions = getNewPackageOptionsTransformer(name)(options);

    this.name = newName === undefined ? initialName : newName;
    this.options = newOptions;
  }

  render() {
    return Object.keys(this.options).length > 0
      ? [this.name, this.options]
      : this.name;
  }
}

function parseConfigCollection(collection) {
  if (!Array.isArray(collection) && typeof collection === 'string') {
    return collection.split(',').map(collection => collection.trim());
  }

  return collection;
}

const buildConfigItemTransformer = configItemType => configItem => {
  const newConfigItem = new ConfigItem(configItem, configItemType);
  return newConfigItem.render();
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
  return presets.find(
    preset =>
      preset === '@babel/preset-flow' || preset[0] === '@babel/preset-flow'
  )
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
    Object.values(config.env).forEach(envConfig =>
      upgradeConfigForEnv(envConfig, options)
    );
  }

  return config;
};
