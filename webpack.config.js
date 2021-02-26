const path = require('path');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/vl-mapactions-all.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vl-mapactions.js',
    library: 'VlMapActions',
    libraryTarget: 'var',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
        },
      }),
    ],
  },
  plugins: [
    new EsmWebpackPlugin(),
  ],
};
