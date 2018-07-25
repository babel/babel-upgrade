const define = defaults => opts => Object.assign(opts, defaults);

const updaters = {
  __proto__: null,
  "@babel/plugin-proposal-decorators": define({ legacy: true }),
  "@babel/plugin-syntax-decorators": define({ legacy: true }),

  "@babel/plugin-proposal-pipeline-operator": define({ proposal: "minimal" }),
  "@babel/plugin-syntax-pipeline-operator": define({ proposal: "minimal" }),
};

module.exports = function updateOptions(entry) {
  const result = Array.isArray(entry) ? entry : [entry];
  const updater = updaters[result[0]];
  if (!updater) return entry;
  result[1] = updater(result[1] || {});
  return result;
};
