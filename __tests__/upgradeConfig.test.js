const path = require('path');
const upgradeConfig = require('../src/upgradeConfig');
const babelrcFixture = require('../fixtures/babelrc');
const optionParsingFixture = require('../fixtures/option-parsing');
const { readBabelRC } = require('../src');
const JSON5_PATH = path.resolve(__dirname, '../fixtures/babelrc.json5');

test('packages', () => {
  expect(upgradeConfig(babelrcFixture)).toMatchSnapshot();
});

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

test('sets `loose` option on plugins that are now spec by default if needed', () => {
  expect(upgradeConfig({
    plugins: [
      'babel-plugin-transform-class-properties',
      '@babel/plugin-transform-class-properties',
      'babel-plugin-transform-es2015-template-literals',
      '@babel/plugin-transform-es2015-template-literals',
      ['babel-plugin-transform-class-properties'],
      ['@babel/plugin-transform-class-properties'],
      ['babel-plugin-transform-es2015-template-literals'],
      ['@babel/plugin-transform-es2015-template-literals'],
      ['babel-plugin-transform-class-properties', { spec: false }],
      ['@babel/plugin-transform-class-properties', { spec: false }],
      ['babel-plugin-transform-es2015-template-literals', { spec: false }],
      ['@babel/plugin-transform-es2015-template-literals', { spec: false }],
      ['babel-plugin-transform-class-properties', { spec: true }],
      ['@babel/plugin-transform-class-properties', { spec: true }],
      ['babel-plugin-transform-es2015-template-literals', { spec: true }],
      ['@babel/plugin-transform-es2015-template-literals', { spec: true }]
    ]
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
      '@babel/plugin-transform-decorators'
    ],
  };

  expect(upgradeConfig(config)).toMatchSnapshot();
});
