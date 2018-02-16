const { updatePackageJSON } = require('./');
const upgradeDeps = require('./upgradeDeps');
const depsFixture = require('./fixtures-deps');
const scriptsFixture = require('./fixtures-script');

test('packages', () => {
  expect(upgradeDeps(depsFixture, "7.0.0-beta.39")).toMatchSnapshot();
});

test('scripts', () => {
  expect(updatePackageJSON(scriptsFixture)).toMatchSnapshot();
})
