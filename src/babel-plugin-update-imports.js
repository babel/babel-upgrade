const { packages: oldPackages } = require('./packageData');

module.exports = function ({types: t}) {
  return {
    visitor: {
      // `import types from 'babel-types';` -> `import types from '@babel/types';`.
      ImportDeclaration(path) {
        const source = path.node.source.value;

        if (Object.keys(oldPackages).includes(source) && oldPackages[source]) {
          path.node.source.value = oldPackages[source];
        }
      },

      // `require('babel-types')` -> `require('@babel/types')`.
      CallExpression(path) {
        const node = path.node;
        const callee = node.callee;

        if (t.isIdentifier(callee) && callee.name === 'require') {
          const arg = node.arguments[0];

          if (arg && t.isStringLiteral(arg)) {
            const value = arg.value;

            if (Object.keys(oldPackages).includes(value) && oldPackages[value]) {
              node.arguments[0].value = oldPackages[value];
            }
          }
        }
      },
    },
  };
};
