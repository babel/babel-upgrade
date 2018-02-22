const hasYarn = require('has-yarn');
const spawn = require('cross-spawn');

module.exports = function installDeps(cwd) {
  const isYarn = hasYarn(cwd);
  const cmd = isYarn ? 'yarn' : 'npm';
  const args = ['install'];

  console.log(`Installing dependencies using "${cmd}"`);

  spawn.sync(cmd, args, { stdio: 'inherit' });
};
