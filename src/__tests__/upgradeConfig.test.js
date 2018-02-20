const path = require('path');
const upgradeConfig = require('../upgradeConfig');
const babelrcFixture = require('../../fixtures/babelrc');
const { readBabelRC } = require('../');
const JSON5_PATH = path.resolve(__dirname, '../../fixtures/babelrc.json5');

test('packages', () => {
  expect(upgradeConfig(babelrcFixture)).toMatchSnapshot();
});

test('packages (json5)', async () => {
  const json5Data = await readBabelRC(JSON5_PATH);
  expect(upgradeConfig(json5Data)).toMatchSnapshot();
});
