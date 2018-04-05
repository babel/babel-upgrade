
const { writePackageJSON, writeBabelRC, writeMochaOpts } = require('../src/');

jest.mock('write-json-file', () => jest.fn().mockResolvedValue({}));
jest.mock('write', () => jest.fn().mockResolvedValue({}));

const writeJsonFile = require('write-json-file');
const writeFile = require('write');

test('respects dry run', async () => {
  
  await writePackageJSON({ dryRun: true });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

  await writeBabelRC("./fixtures/babelrc.json5", { dryRun: true });
  expect(writeJsonFile).not.toBeCalled();
  writeJsonFile.mockReset();

  await writeMochaOpts("./fixtures/scripts-mocha.json", { dryRun: true });
  expect(writeFile).not.toBeCalled();
  writeFile.mockReset();

})

test('write when dry run is not passed', async () => {

  await writePackageJSON({ dryRun: false });
  expect(writeJsonFile).toBeCalled();
  writeJsonFile.mockReset();

  await writeBabelRC("./fixtures/babelrc.json5", { dryRun: false });
  expect(writeJsonFile).toBeCalled();
  writeJsonFile.mockReset();

  await writeMochaOpts("./fixtures/scripts-mocha.json", { dryRun: false });
  expect(writeFile).toBeCalled();
  writeFile.mockReset();
})