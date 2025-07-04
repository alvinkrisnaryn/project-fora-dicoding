const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: [
      path.resolve(__dirname, "dist"),
      path.resolve(__dirname, "src/public"),
    ],
    port: 8080,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    onListening: (server) => {
      console.log("Serving static files from:", server.options.static);
    },
  },
});
