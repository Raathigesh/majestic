const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = env => ({
  entry: "./ui/index.tsx",
  mode: env.production ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "ui.bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    hot: true,
    port: 9000
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 50000
          }
        }
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-react-loader"
          }
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader",
            // compiles Less to CSS
            options: {
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Majestic",
      template: require("html-webpack-template"),
      appMountId: "root",
      inject: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
