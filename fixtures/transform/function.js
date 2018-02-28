function createBabelrc() {
  return {
    plugins: [
      'babel-plugin-transform-es2015-classes',
      'babel-plugin-syntax-jsx',
      'babel-plugin-transform-pipeline-operator'
    ],
    presets: ['babel-preset-env', 'babel-preset-react']
  };
}

module.exports = createBabelrc();
