 
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  output: {
    filename: 'dokeo.bundle.js'
  },
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* opções adicionais aqui */ })],
  },
};
