const jscodeshift = require('jscodeshift');
const packageData = require('./packageData');

// for .babelrc.js
function transform(src) {
  const res = jscodeshift(src)
    .find(jscodeshift.Property)
    .forEach((node) => {
      const type = node.value.key.name;
      const value = node.value.value;

      if (type === 'plugins') {
        if (value.type === 'ArrayExpression') {
          value.elements.forEach(el => {
            el.value = packageData.plugins[el.value] || el.value;
          })
        }
      } else if (type === 'presets') {
        if (value.type === 'ArrayExpression') {
          value.elements.forEach(el => {
            el.value = packageData.presets[el.value] || el.value;
          })
        }
      }
    })
    .toSource();

  return res;
}

module.exports = transform;
