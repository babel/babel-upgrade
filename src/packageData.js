const transformPlugins = {
  'babel-plugin-transform-async-to-generator': '@babel/plugin-transform-async-to-generator',
  'babel-plugin-transform-eval': '@babel/plugin-transform-eval',
  'babel-plugin-transform-exponentiation-operator': '@babel/plugin-transform-exponentiation-operator',
  'babel-plugin-transform-flow-comments': '@babel/plugin-transform-flow-comments',
  'babel-plugin-transform-flow-strip-types': '@babel/plugin-transform-flow-strip-types',
  'babel-plugin-transform-jscript': '@babel/plugin-transform-jscript',
  'babel-plugin-transform-new-target': '@babel/plugin-transform-new-target',
  'babel-plugin-transform-typeof-symbol': '@babel/plugin-transform-typeof-symbol',
  'babel-plugin-transform-runtime': '@babel/plugin-transform-runtime',
  'babel-plugin-transform-strict-mode': '@babel/plugin-transform-strict-mode',
  'babel-plugin-transform-proto-to-assign': '@babel/plugin-transform-proto-to-assign',
  'babel-plugin-transform-object-assign': '@babel/plugin-transform-object-assign',
  'babel-plugin-transform-object-set-prototype-of-to-assign': '@babel/plugin-transform-object-set-prototype-of-to-assign',
  'babel-plugin-transform-typescript': '@babel/plugin-transform-typescript',

  'babel-plugin-transform-es3-reserved-words': '@babel/plugin-transform-reserved-words',
  'babel-plugin-transform-es3-member-expression-literals': '@babel/plugin-transform-member-expression-literals',
  'babel-plugin-transform-es3-property-literals': '@babel/plugin-transform-property-literals',
  'babel-plugin-transform-es5-property-mutators': '@babel/plugin-transform-property-mutators',

  '@babel/plugin-transform-es3-reserved-words': '@babel/plugin-transform-reserved-words',
  '@babel/plugin-transform-es3-member-expression-literals': '@babel/plugin-transform-member-expression-literals',
  '@babel/plugin-transform-es3-property-literals': '@babel/plugin-transform-property-literals',
  '@babel/plugin-transform-es5-property-mutators': '@babel/plugin-transform-property-mutators',

  'babel-plugin-transform-es2015-arrow-functions': '@babel/plugin-transform-arrow-functions',
  'babel-plugin-transform-es2015-block-scoped-functions': '@babel/plugin-transform-block-scoped-functions',
  'babel-plugin-transform-es2015-block-scoping': '@babel/plugin-transform-block-scoping',
  'babel-plugin-transform-es2015-classes': '@babel/plugin-transform-classes',
  'babel-plugin-transform-es2015-computed-properties': '@babel/plugin-transform-computed-properties',
  'babel-plugin-transform-es2015-destructuring': '@babel/plugin-transform-destructuring',
  'babel-plugin-transform-es2015-duplicate-keys': '@babel/plugin-transform-duplicate-keys',
  'babel-plugin-transform-es2015-for-of': '@babel/plugin-transform-for-of',
  'babel-plugin-transform-es2015-function-name': '@babel/plugin-transform-function-name',
  'babel-plugin-transform-es2015-instanceof': '@babel/plugin-transform-instanceof',
  'babel-plugin-transform-es2015-literals': '@babel/plugin-transform-literals',
  'babel-plugin-transform-es2015-modules-amd': '@babel/plugin-transform-modules-amd',
  'babel-plugin-transform-es2015-modules-commonjs': '@babel/plugin-transform-modules-commonjs',
  'babel-plugin-transform-es2015-modules-systemjs': '@babel/plugin-transform-modules-systemjs',
  'babel-plugin-transform-es2015-modules-umd': '@babel/plugin-transform-modules-umd',
  'babel-plugin-transform-es2015-object-super': '@babel/plugin-transform-object-super',
  'babel-plugin-transform-es2015-parameters': '@babel/plugin-transform-parameters',
  'babel-plugin-transform-es2015-unicode-regex': '@babel/plugin-transform-unicode-regex',
  'babel-plugin-transform-es2015-shorthand-properties': '@babel/plugin-transform-shorthand-properties',
  'babel-plugin-transform-es2015-spread': '@babel/plugin-transform-spread',
  'babel-plugin-transform-es2015-sticky-regex': '@babel/plugin-transform-sticky-regex',
  'babel-plugin-transform-es2015-template-literals': '@babel/plugin-transform-template-literals',

  '@babel/plugin-transform-es2015-arrow-functions': '@babel/plugin-transform-arrow-functions',
  '@babel/plugin-transform-es2015-block-scoped-functions': '@babel/plugin-transform-block-scoped-functions',
  '@babel/plugin-transform-es2015-block-scoping': '@babel/plugin-transform-block-scoping',
  '@babel/plugin-transform-es2015-classes': '@babel/plugin-transform-classes',
  '@babel/plugin-transform-es2015-computed-properties': '@babel/plugin-transform-computed-properties',
  '@babel/plugin-transform-es2015-destructuring': '@babel/plugin-transform-destructuring',
  '@babel/plugin-transform-es2015-duplicate-keys': '@babel/plugin-transform-duplicate-keys',
  '@babel/plugin-transform-es2015-for-of': '@babel/plugin-transform-for-of',
  '@babel/plugin-transform-es2015-function-name': '@babel/plugin-transform-function-name',
  '@babel/plugin-transform-es2015-instanceof': '@babel/plugin-transform-instanceof',
  '@babel/plugin-transform-es2015-literals': '@babel/plugin-transform-literals',
  '@babel/plugin-transform-es2015-modules-amd': '@babel/plugin-transform-modules-amd',
  '@babel/plugin-transform-es2015-modules-commonjs': '@babel/plugin-transform-modules-commonjs',
  '@babel/plugin-transform-es2015-modules-systemjs': '@babel/plugin-transform-modules-systemjs',
  '@babel/plugin-transform-es2015-modules-umd': '@babel/plugin-transform-modules-umd',
  '@babel/plugin-transform-es2015-object-super': '@babel/plugin-transform-object-super',
  '@babel/plugin-transform-es2015-parameters': '@babel/plugin-transform-parameters',
  '@babel/plugin-transform-es2015-unicode-regex': '@babel/plugin-transform-unicode-regex',
  '@babel/plugin-transform-es2015-shorthand-properties': '@babel/plugin-transform-shorthand-properties',
  '@babel/plugin-transform-es2015-spread': '@babel/plugin-transform-spread',
  '@babel/plugin-transform-es2015-sticky-regex': '@babel/plugin-transform-sticky-regex',
  '@babel/plugin-transform-es2015-template-literals': '@babel/plugin-transform-template-literals',

  'babel-plugin-transform-react-constant-elements': '@babel/plugin-transform-react-constant-elements',
  'babel-plugin-transform-react-display-name': '@babel/plugin-transform-react-display-name',
  'babel-plugin-transform-react-inline-elements': '@babel/plugin-transform-react-inline-elements',
  'babel-plugin-transform-react-jsx-compat': '@babel/plugin-transform-react-jsx-compat',
  'babel-plugin-transform-react-jsx-self': '@babel/plugin-transform-react-jsx-self',
  'babel-plugin-transform-react-jsx-source': '@babel/plugin-transform-react-jsx-source',
  'babel-plugin-transform-react-jsx': '@babel/plugin-transform-react-jsx',
  'babel-plugin-transform-regenerator': '@babel/plugin-transform-regenerator',
}

const syntaxPlugins = {
  'babel-plugin-syntax-async-generators': '@babel/plugin-syntax-async-generators',
  'babel-plugin-syntax-class-properties': '@babel/plugin-syntax-class-properties',
  'babel-plugin-syntax-decorators': '@babel/plugin-syntax-decorators',
  'babel-plugin-syntax-do-expressions': '@babel/plugin-syntax-do-expressions',
  'babel-plugin-syntax-dynamic-import': '@babel/plugin-syntax-dynamic-import',
  'babel-plugin-syntax-export-extensions': ['@babel/plugin-syntax-export-default-from', '@babel/plugin-syntax-export-namespace-from'],
  'babel-plugin-syntax-export-default-from': '@babel/plugin-syntax-export-default-from',
  'babel-plugin-syntax-export-namespace-from': '@babel/plugin-syntax-export-namespace-from',
  'babel-plugin-syntax-flow': '@babel/plugin-syntax-flow',
  'babel-plugin-syntax-function-bind': '@babel/plugin-syntax-function-bind',
  'babel-plugin-syntax-function-sent': '@babel/plugin-syntax-function-sent',
  'babel-plugin-syntax-import-meta': '@babel/plugin-syntax-import-meta',
  'babel-plugin-syntax-jsx': '@babel/plugin-syntax-jsx',
  'babel-plugin-syntax-nullish-coalescing-operator': '@babel/plugin-syntax-nullish-coalescing-operator',
  'babel-plugin-syntax-numeric-separator': '@babel/plugin-syntax-numeric-separator',
  'babel-plugin-syntax-object-rest-spread': '@babel/plugin-syntax-object-rest-spread',
  'babel-plugin-syntax-optional-catch-binding': '@babel/plugin-syntax-optional-catch-binding',
  'babel-plugin-syntax-optional-chaining': '@babel/plugin-syntax-optional-chaining',
  'babel-plugin-syntax-pipeline-operator': '@babel/plugin-syntax-pipeline-operator',
  'babel-plugin-syntax-throw-expressions': '@babel/plugin-syntax-throw-expressions',
  'babel-plugin-syntax-typescript': '@babel/plugin-syntax-typescript',
  // export
  '@babel/plugin-syntax-export-extensions': ['@babel/plugin-syntax-export-default-from', '@babel/plugin-syntax-export-namespace-from'],
}

// to scoped packages
// https://github.com/babel/babel/pull/6495
// Oct 17, 2017

// -transform- to -proposal-
// https://github.com/babel/babel/commit/c41abd79a1065d72cd9b8a02830c3e9f80d71a42
// Oct 27, 2017

// remove -es2015- prefixes
// https://github.com/babel/babel/pull/6575
// Oct 28, 2017

// proposal-export-default to proposal-export-default-from
// https://github.com/babel/babel/commit/d8bbaaae0a132cf464c27126957bd66d74b2bf65
// Nov 30, 2017

const proposalPlugins = {
  // not scoped, transform
  'babel-plugin-transform-async-generator-functions': '@babel/plugin-proposal-async-generator-functions',
  'babel-plugin-transform-class-properties': '@babel/plugin-proposal-class-properties',
  'babel-plugin-transform-decorators': '@babel/plugin-proposal-decorators',
  'babel-plugin-transform-do-expressions': '@babel/plugin-proposal-do-expressions',
  'babel-plugin-transform-export-default': ['@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-export-namespace-from'],
  'babel-plugin-transform-export-extensions': ['@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-export-namespace-from'],
  'babel-plugin-transform-export-default-from': '@babel/plugin-proposal-export-default-from',
  'babel-plugin-transform-export-namespace-from': '@babel/plugin-proposal-export-namespace-from',
  'babel-plugin-transform-function-bind': '@babel/plugin-proposal-function-bind',
  'babel-plugin-transform-function-sent': '@babel/plugin-proposal-function-sent',
  'babel-plugin-transform-function-sent2': '@babel/plugin-proposal-function-sent',
  'babel-plugin-transform-nullish-coalescing-operator': '@babel/plugin-proposal-nullish-coalescing-operator',
  'babel-plugin-transform-numeric-separator': '@babel/plugin-proposal-numeric-separator',
  'babel-plugin-transform-object-rest-spread': '@babel/plugin-proposal-object-rest-spread',
  'babel-plugin-transform-optional-catch-binding': '@babel/plugin-proposal-optional-catch-binding',
  'babel-plugin-transform-optional-chaining': '@babel/plugin-proposal-optional-chaining',
  'babel-plugin-transform-pipeline-operator': '@babel/plugin-proposal-pipeline-operator',
  'babel-plugin-transform-throw-expressions': '@babel/plugin-proposal-throw-expressions',
  'babel-plugin-transform-unicode-property-regex': '@babel/plugin-proposal-unicode-property-regex',
  // scoped, transform
  '@babel/plugin-transform-async-generator-functions': '@babel/plugin-proposal-async-generator-functions',
  '@babel/plugin-transform-class-properties': '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-decorators': '@babel/plugin-proposal-decorators',
  '@babel/plugin-transform-do-expressions': '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-transform-export-extensions': ['@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-export-namespace-from'],
  '@babel/plugin-transform-function-bind': '@babel/plugin-proposal-function-bind',
  '@babel/plugin-transform-function-sent': '@babel/plugin-proposal-function-sent',
  '@babel/plugin-transform-function-sent2': '@babel/plugin-proposal-function-sent',
  '@babel/plugin-transform-nullish-coalescing-operator': '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-transform-numeric-separator': '@babel/plugin-proposal-numeric-separator',
  '@babel/plugin-transform-object-rest-spread': '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-transform-optional-catch-binding': '@babel/plugin-proposal-optional-catch-binding',
  '@babel/plugin-transform-optional-chaining': '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-transform-pipeline-operator': '@babel/plugin-proposal-pipeline-operator',
  '@babel/plugin-transform-throw-expressions': '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-transform-unicode-property-regex': '@babel/plugin-proposal-unicode-property-regex',
  // scoped, proposal
  '@babel/plugin-proposal-export-extensions': ['@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-export-namespace-from'],

};

const presets = {
  'babel-preset-es2015': '@babel/preset-env', // just change these to env
  'babel-preset-es2016': '@babel/preset-env',
  'babel-preset-es2017': '@babel/preset-env',
  'babel-preset-flow': '@babel/preset-flow',
  'babel-preset-react': '@babel/preset-react',
  'babel-preset-stage-0': '@babel/preset-stage-0',
  'babel-preset-stage-1': '@babel/preset-stage-1',
  'babel-preset-stage-2': '@babel/preset-stage-2',
  'babel-preset-stage-3': '@babel/preset-stage-3',
  'babel-preset-typescript': '@babel/preset-typescript',
  'babel-preset-env': '@babel/preset-env',
}

const helpers = {
  'babel-helper-annotate-as-pure': '@babel/helper-annotate-as-pure',
  'babel-helper-bindify-decorators': '@babel/helper-bindify-decorators',
  'babel-helper-builder-binary-assignment-operator-visitor': '@babel/helper-builder-binary-assignment-operator-visitor',
  'babel-helper-builder-react-jsx': '@babel/helper-builder-react-jsx',
  'babel-helper-call-delegate': '@babel/helper-call-delegate',
  'babel-helper-define-map': '@babel/helper-define-map',
  'babel-helper-explode-assignable-expression': '@babel/helper-explode-assignable-expression',
  'babel-helper-explode-class': '@babel/helper-explode-class',
  'babel-helper-fixtures': '@babel/helper-fixtures',
  'babel-helper-function-name': '@babel/helper-function-name',
  'babel-helper-get-function-arity': '@babel/helper-get-function-arity',
  'babel-helper-hoist-variables': '@babel/helper-hoist-variables',
  'babel-helper-module-imports': '@babel/helper-module-imports',
  'babel-helper-module-transforms': '@babel/helper-module-transforms',
  'babel-helper-optimise-call-expression': '@babel/helper-optimise-call-expression',
  'babel-helper-plugin-test-runner': '@babel/helper-plugin-test-runner',
  'babel-helper-regex': '@babel/helper-regex',
  'babel-helper-remap-async-to-generator': '@babel/helper-remap-async-to-generator',
  'babel-helper-replace-supers': '@babel/helper-replace-supers',
  'babel-helper-simple-access': '@babel/helper-simple-access',
  'babel-helper-transform-fixture-test-runner': '@babel/helper-transform-fixture-test-runner',
  'babel-helper-wrap-function': '@babel/helper-wrap-function',
  'babel-helpers': '@babel/helpers',
}

// using null to specify "removed"

const misc = {
  'babel': null,
  'babel-cli': '@babel/cli',
  'babel-code-frame': '@babel/code-frame',
  'babel-core': '@babel/core',
  'babel-generator': '@babel/generator',
  'babel-node': '@babel/node',
  'babel-polyfill': '@babel/polyfill',
  'babel-preset-env-standalone': '@babel/preset-env-standalone',
  'babel-register': '@babel/register',
  'babel-runtime': '@babel/runtime',
  'babel-standalone': '@babel/standalone',
  'babel-template': '@babel/template',
  'babel-traverse': '@babel/traverse',
  'babel-types': '@babel/types',
  // 'babylon': '@babel/parser',
}

const plugins = Object.assign({
  'babel-plugin-check-es2015-constants': null,
  'babel-plugin-external-helpers': '@babel/plugin-external-helpers',
  'babel-plugin-codemod-optional-catch-binding': '@babel/plugin-codemod-optional-catch-binding',
},
transformPlugins,
syntaxPlugins,
proposalPlugins);

const packages = Object.assign(
  {},
  plugins,
  presets,
  helpers,
  misc,
);

const latestPackages = new Set(Object.values(packages));

module.exports = {
  packages,
  presets,
  plugins,
  latestPackages,
};
