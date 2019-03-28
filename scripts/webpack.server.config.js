const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = (env) => ({
  entry: "./server/index.ts",
  mode: "production",
  target: "node",
  output: {
    path: path.resolve(__dirname, "../dist/server"),
    filename: "index.js",
    libraryTarget: "commonjs2"
  },
  resolve: {
    mainFields: ["main"],
    extensions: [".ts", ".js", ".jsx"]
  },
  optimization: {
    minimize: false
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader"
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        loader: "awesome-typescript-loader",
        options: {
          transpileOnly: true,
          configFileName: "./tsconfig.server.json"
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: env.production === "production"
    }),
    new CopyPlugin([
      { from: "./server/services/jest-manager/scripts", to: "./scripts" }
    ]),
    new webpack.BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true
    })
  ],
  externals: ["read-pkg-up", "open"],
  node: {
    __dirname: false
  }
});
