const { updatePackageJSON } = require('../src/');
const upgradeDeps = require('../src/upgradeDeps');
const babelCoreFixture = require('../fixtures/babel-core');
const jestFixture = require('../fixtures/jest');
const jestCliFixture = require('../fixtures/jest-cli');
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

  test('splits runtime into runtime and runtime-corejs2', () => {
    expect(upgradeDeps({
      "@babel/runtime": "7.0.0-alpha.0",
    }, VERSION)).toMatchSnapshot();
  });

  test("doesn't add runtime-corejs2 if it is already there", () => {
    expect(upgradeDeps({
      "@babel/runtime": "7.0.0-alpha.0",
      "@babel/runtime-corejs2": "7.0.0-alpha.0",
    }, VERSION)).toMatchSnapshot();
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

test('jest-cli babel-core bridge', async () => {
  expect(await updatePackageJSON(jestCliFixture)).toMatchSnapshot();
});

test('webpack v1 compatibility', async () => {
  expect(await updatePackageJSON(webpackV1Fixture)).toMatchSnapshot();
});

test('replaces stage presets', () => {
  expect(upgradeDeps({
    "@babel/preset-stage-2": "7.0.0-alpha.0"
  }, VERSION)).toMatchSnapshot();
});
