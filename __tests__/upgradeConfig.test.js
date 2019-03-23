const path = require('path');
const upgradeConfig = require('../src/upgradeConfig');
const babelrcFixture = require('../fixtures/babelrc');
const optionParsingFixture = require('../fixtures/option-parsing');
const dupesProspectFixture = require('../fixtures/dupes-prospect');
const { readBabelRC } = require('../src');
const JSON5_PATH = path.resolve(__dirname, '../fixtures/babelrc.json5');

test('packages', () => {
  expect(upgradeConfig(babelrcFixture)).toMatchSnapshot();
});

test('new plugins with array', () => {
  expect(upgradeConfig({
    plugins: [
      'babel-plugin-syntax-async-generators',
      'babel-plugin-syntax-export-extensions',
      ["babel-plugin-transform-es2015-arrow-functions", { "spec": true }]
    ]
  })).toMatchSnapshot();
})

test('package that is removed', () => {
  expect(upgradeConfig({
    plugins: [
      'transform-function-bind',
      'check-es2015-constants',
      'transform-es2015-spread',
      'instanbul'
    ]
  })).toMatchSnapshot();
});

test('rename community packages', () => {
  expect(upgradeConfig({
    plugins: [
      'lodash'
    ],
    env: {
      development: {
        plugins: [
          'lodash'
        ]
      }
    }
  })).toMatchSnapshot();
});

test('packages (json5)', async () => {
  const json5Data = await readBabelRC(JSON5_PATH);
  expect(upgradeConfig(json5Data)).toMatchSnapshot();
});

test('convert comma separated presets/plugins into an array', () => {
  expect(upgradeConfig(optionParsingFixture)).toMatchSnapshot();
});

test('adds flow preset if hasFlow option passed', () => {
  const config = {
    "presets": ["react"],
  };

  expect(upgradeConfig(config, { hasFlow: true })).toMatchSnapshot();
});

test('does not add flow preset if hasFlow option is not passed', () => {
  const config = {
    "presets": ["react"],
  };

  expect(upgradeConfig(config, { hasFlow: false })).toMatchSnapshot();
});

test('does not another flow preset if already present and hasFlow option passed', () => {
  const config = {
    "presets": [
      "@babel/preset-react",
      "@babel/preset-flow",
    ],
  };

  expect(upgradeConfig(config, { hasFlow: true })).toMatchSnapshot();
});

test('handles @babel prefix in plugins', () => {
  const config = {
    "plugins": [
      '@babel/plugin-transform-async-generator-functions',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-do-expressions'
    ],
  };

  expect(upgradeConfig(config)).toMatchSnapshot();
});

test("adds legacy option to decorators", () => {
  const config = {
    "plugins": [
      "transform-decorators",
      "@babel/plugin-syntax-decorators"
    ],
  };

  expect(upgradeConfig(config)).toMatchSnapshot();
});

test("adds proposal option to pipeline", () => {
  const config = {
    "plugins": [
      "transform-pipeline-operator",
      "@babel/plugin-syntax-pipeline-operator"
    ],
  };

  expect(upgradeConfig(config)).toMatchSnapshot();
});

test("replaces stage presets", () => {
  const config = {
    "presets": [
      "stage-1"
    ]
  };

  expect(upgradeConfig(config)).toMatchSnapshot();
});

test("prevent dupe plugins", () => {
  expect(upgradeConfig(dupesProspectFixture)).toMatchSnapshot();
});

test("adds corejs to babel 6 transform-runtime", () => {
  const config = { "plugins": ["transform-runtime"] };

  expect(upgradeConfig(config)).toMatchSnapshot();
});

test("doesn't add corejs to babel 7 transform-runtime", () => {
  const config = { "plugins": ["@babel/transform-runtime"] };

  expect(upgradeConfig(config)).toMatchSnapshot();
});
