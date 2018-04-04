const { updatePackageJSON, writePackageJSON, writeBabelRC, writeMochaOpts } = require('../src/');
const upgradeDeps = require('../src/upgradeDeps');
const babelCoreFixture = require('../fixtures/babel-core');
const jestFixture = require('../fixtures/jest');
const depsFixture = require('../fixtures/deps');
const webpackV1Fixture = require('../fixtures/webpack-v1');
const depsFixtureEarlierBeta = require('../fixtures/deps-earlier-beta.json');
const scriptsMochaFixture = require('../fixtures/scripts-mocha');
const scriptsBabelNodeFixture = require('../fixtures/scripts-babel-node');

const VERSION = "7.0.0-beta.39";

describe('upgradeDeps', () => {
  test('upgrades from v6', () => {
    expect(upgradeDeps(depsFixture, VERSION)).toMatchSnapshot();
  });

  test('upgrades from earlier v7 version', () => {
    expect(upgradeDeps(depsFixtureEarlierBeta, VERSION)).toMatchSnapshot();
  });

  test('adds flow preset if user was using v6 preset-react', () => {
    expect(upgradeDeps({
      "babel-preset-react": "6.0.0"
    }, VERSION, { hasFlow: true })).toMatchSnapshot();
  });

  test('does not add flow preset if user was using v6 preset-react but flow not detected', () => {
    expect(upgradeDeps({
      "babel-preset-react": "6.0.0"
    }, VERSION, { hasFlow: false })).toMatchSnapshot();
  });

  test('adds flow preset if user is upgrading from previous v7', () => {
    expect(upgradeDeps({
      "@babel/preset-react": "7.0.0-alpha.0",
    }, VERSION, { hasFlow: true })).toMatchSnapshot();
  });

  test('does not add flow preset if user is upgrading from previous v7 but flow not detected', () => {
    expect(upgradeDeps({
      "@babel/preset-react": "7.0.0-alpha.0",
    }, VERSION, { hasFlow: false })).toMatchSnapshot();
  });

  test('handles flow preset if user had entry and is upgrading from previous v7', () => {
    expect(upgradeDeps({
      "@babel/preset-flow": "7.0.0-alpha.0",
      "@babel/preset-react": "7.0.0-alpha.0",
    }, VERSION, { hasFlow: true })).toMatchSnapshot();
  });

  test('handles flow preset if user had entry and is upgrading from previous v7 and flow not detected', () => {
    expect(upgradeDeps({
      "@babel/preset-flow": "7.0.0-alpha.0",
      "@babel/preset-react": "7.0.0-alpha.0",
    }, VERSION, { hasFlow: false })).toMatchSnapshot();
  });
});

test('scripts', async () => {
  expect(await updatePackageJSON(scriptsMochaFixture)).toMatchSnapshot();
  expect(await updatePackageJSON(scriptsBabelNodeFixture)).toMatchSnapshot();
});

test('@babel/core peerDep', async () => {
  expect(await updatePackageJSON(babelCoreFixture)).toMatchSnapshot();
});

test('jest babel-core bridge', async () => {
  expect(await updatePackageJSON(jestFixture)).toMatchSnapshot();
});

test('webpack v1 compatibility', async () => {
  expect(await updatePackageJSON(webpackV1Fixture)).toMatchSnapshot();
});

test('respects dry run', async () => {
  jest.doMock('write-json-file', () => jest.fn().mockResolvedValue({}));
  const writeJsonFile = require('write-json-file');
  
  await writePackageJSON({ dryRun: true });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

  await writeBabelRC(".babelrc", { dryRun: true });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

  await writeMochaOpts(".babelrc", { dryRun: true });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

})