const path = require('path');
const upgradeConfig = require('../src/upgradeConfig');
const babelrcFixture = require('../fixtures/babelrc');
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
