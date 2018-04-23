
const { writePackageJSON, writeBabelRC, writeMochaOpts } = require('../src/');

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
