const JSON5 = require('json5');
const fs = require('fs');
const pify = require('pify');
const crossSpawn = require('cross-spawn');
const rimraf = require('rimraf');

async function gitCheckout(dir, repo, branch = 'master') {
  const gitArgs = ['clone', repo, '--branch', branch, '--single-branch', dir];

  // pify only works with callback style
  // crossSpawn which uses child_process.spawn has no callback style
  return new Promise((resolve, reject) => {
    const child = crossSpawn('git', gitArgs);
    child.on('error', (err) => reject(err, err.stack));
    child.on('close', () => resolve());
  });
}

async function babelUpgrade(dir) {
  // pify only works with callback style
  // crossSpawn which uses child_process.spawn has no callback style
  return new Promise((resolve, reject) => {
    const child = crossSpawn('node', ['../../bin/babel-upgrade'], { cwd: dir });
    child.on('error', (err) => reject(err, err.stack));
    child.on('close', () => resolve());
  });
}

async function gitDiff(dir) {
  // pify only works with callback style
  // crossSpawn which uses child_process.spawn has no callback style
  return new Promise((resolve, reject) => {
    let result = '';
    const child = crossSpawn('git', ['--no-pager', 'diff', '--no-color', '-U0'], { cwd: dir });
    child.stdout.on('data', d => result += d.toString());
    child.on('error', err => reject(err));
    child.on('close', () => resolve(result));
  })
}

describe('smoke tests', function () {
  afterAll(async function() {
    await pify(rimraf)('./filetests');
  });

  it('babel-preset-env', async function () {
    const dir = './filetests/babel-preset-env';

    await gitCheckout(dir, 'https://github.com/babel/babel-preset-env', '1.x');
    await babelUpgrade(dir);

    expect(await gitDiff(dir)).toMatchSnapshot();
  }, 10000);

  it('screeps-flowtype-jest-skeleton', async function () {
    const dir = './filetests/screeps-flowtype-jest-skeleton';

    await gitCheckout(dir, 'https://github.com/FossiFoo/screeps-flowtype-jest-skeleton');
    await babelUpgrade(dir);

    expect(await gitDiff(dir)).toMatchSnapshot();
  }, 10000);

  it('react-side-effect', async function () {
    const dir = './filetests/react-side-effect';

    await gitCheckout(dir, 'https://github.com/gaearon/react-side-effect');
    await babelUpgrade(dir);

    expect(await gitDiff(dir)).toMatchSnapshot();
  }, 10000);
});
