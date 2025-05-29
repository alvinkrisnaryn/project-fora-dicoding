const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [], // Aturan CSS dihapus karena sudah ada di webpack.common.js
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    host: "0.0.0.0",
    port: 8080,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    open: true,
  },
});
