const upgradeDeps = require('./upgradeDeps');
const depsFixture = require('./fixtures-deps');

test('packages', () => {
  expect(upgradeDeps(depsFixture, "7.0.0-beta.39")).toMatchSnapshot();
});
