
const { updatePackageJSON, writePackageJSON, writeBabelRC, writeMochaOpts } = require('../src/');

jest.mock('write-json-file', () => jest.fn().mockResolvedValue({}));
jest.mock('write', () => jest.fn().mockResolvedValue({}));

const writeJsonFile = require('write-json-file');
const writeFile = require('write');

let logSpy;
let warnSpy;

beforeAll(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  logSpy.mockReset();
  warnSpy.mockReset();
});

test('does not write when --write is not passed', async () => {

  await writePackageJSON({ write: false });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

  await writeBabelRC("./fixtures/babelrc.json5", { write: false });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

  await writeMochaOpts("./fixtures/scripts-mocha.json", { write: false });
  expect(writeFile).not.toBeCalled();
  writeFile.mockReset();

});

test('writes when --write is passed', async () => {

  await writePackageJSON({ write: true });
  expect(writeJsonFile).toBeCalled();
  writeJsonFile.mockReset();

  await writeBabelRC("./fixtures/babelrc.json5", { write: true });
  expect(writeJsonFile).toBeCalled();
  writeJsonFile.mockReset();

  await writeMochaOpts("./fixtures/scripts-mocha.json", { write: true });
  expect(writeFile).toBeCalled();
  writeFile.mockReset();

});

test('do not downgrade dependencies', async () => {

  let pkg = await updatePackageJSON({
    dependencies: {
      'babel-loader': '^9.0.0',
      'rollup-plugin-babel': '^5.0.1',
      'babel-eslint': '^10.0.0',
    }
  });
  expect(pkg).toMatchSnapshot();

});

describe('flow preset', () => {

  test('adds flow preset if user was using v6 preset-react', async () => {
    let pkg = await updatePackageJSON({
      dependencies: {},
      devDependencies: {
        "babel-preset-react": "6.0.0"
      }
    }, { hasFlow: true });
    expect(pkg).toMatchSnapshot();
  });

  test('does not add flow preset if user was using v6 preset-react but flow not detected', async () => {
    let pkg = await updatePackageJSON({
      dependencies: {},
      devDependencies: {
        "babel-preset-react": "6.0.0"
      }
    }, { hasFlow: false });
    expect(pkg).toMatchSnapshot();
  });

  test('adds flow preset if user is upgrading from previous v7', async () => {
    let pkg = await updatePackageJSON({
      dependencies: {},
      devDependencies: {
        "@babel/preset-react": "7.0.0-alpha.0"
      }
    }, { hasFlow: true });
    expect(pkg).toMatchSnapshot();
  });

  test('does not add flow preset if user is upgrading from previous v7 but flow not detected', async () => {
    let pkg = await updatePackageJSON({
      dependencies: {},
      devDependencies: {
        "@babel/preset-react": "7.0.0-alpha.0",
      }
    }, { hasFlow: false });
    expect(pkg).toMatchSnapshot();
  });

  test('handles flow preset if user had entry and is upgrading from previous v7', async () => {
    let pkg = await updatePackageJSON({
      dependencies: {},
      devDependencies: {
        "@babel/preset-flow": "7.0.0-alpha.0",
        "@babel/preset-react": "7.0.0-alpha.0",
      }
    }, { hasFlow: true });
    expect(pkg).toMatchSnapshot();
  });

  test('handles flow preset if user had entry and is upgrading from previous v7 and flow not detected', async () => {
    let pkg = await updatePackageJSON({
      dependencies: {},
      devDependencies: {
        "@babel/preset-flow": "7.0.0-alpha.0",
        "@babel/preset-react": "7.0.0-alpha.0",
      }
    }, { hasFlow: false });
    expect(pkg).toMatchSnapshot();
  });
});
