const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require("../package.json")


const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    port: 8080,
    historyApiFallback: {
      index: "index.html",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        marketing: 'marketing@http://localhost:8181/remoteEntry.js'
      },
      shared: packageJson.dependencies
    })
  ],
};

module.exports = merge(common, devConfig);
