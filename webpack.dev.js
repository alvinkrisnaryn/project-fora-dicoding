const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [], // Aturan CSS dihapus karena sudah ada di webpack.common.js
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/service-worker.js"),
          to: path.resolve(__dirname, "dist/service-worker.js"),
        },
      ],
    }),
  ],
});