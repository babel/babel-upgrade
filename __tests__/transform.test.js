const fs = require('fs');
const path = require('path');
const pify = require('pify');
const transform = require('../src/transform');

async function readFile(configPath) {
  return (await pify(fs.readFile)(path.join(__dirname, configPath), 'utf8'));
}

describe('transform', () => {
  test('basic', async () => {
    const src = await readFile('../fixtures/transform/basic.js');
    expect(transform(src)).toMatchSnapshot();
  });

  test('function', async () => {
    const src = await readFile('../fixtures/transform/function.js');
    expect(transform(src)).toMatchSnapshot();
  });
});
