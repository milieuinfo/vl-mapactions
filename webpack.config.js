const path = require('path');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/vl-mapactions-all.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vl-mapactions.js',
    library: 'VlMapActions',
    libraryTarget: 'var',
  },
  plugins: [
    new EsmWebpackPlugin(),
  ],
};
