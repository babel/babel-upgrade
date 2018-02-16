const upgradeConfig = require('./upgradeConfig');
const babelrcFixture = require('./babelrc');

test('packages', () => {
  expect(upgradeConfig(babelrcFixture)).toMatchSnapshot();
});
