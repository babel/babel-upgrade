const { updatePackageJSON } = require('../');
const upgradeDeps = require('../upgradeDeps');
const babelCoreFixture = require('../../fixtures/babel-core');
const jestFixture = require('../../fixtures/jest');
const depsFixture = require('../../fixtures/deps');
const depsFixtureEarlierBeta = require('../../fixtures/deps-earlier-beta.json');
const scriptsMochaFixture = require('../../fixtures/scripts-mocha');
const scriptsBabelNodeFixture = require('../../fixtures/scripts-babel-node');

test('packages', () => {
  expect(upgradeDeps(depsFixture, "7.0.0-beta.39")).toMatchSnapshot();
});

test('scripts', () => {
  expect(updatePackageJSON(scriptsMochaFixture)).toMatchSnapshot();
  expect(updatePackageJSON(scriptsBabelNodeFixture)).toMatchSnapshot();
});

test('@babel/core peerDep', () => {
  expect(updatePackageJSON(babelCoreFixture)).toMatchSnapshot();
});

test('jest babel-core bridge', () => {
  expect(updatePackageJSON(jestFixture)).toMatchSnapshot();
});

test('packages - earlier v7', () => {
  expect(upgradeDeps(depsFixtureEarlierBeta, "7.0.0-beta.39")).toMatchSnapshot();
});
