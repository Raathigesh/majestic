import * as webpack from "webpack";
import * as middleware from "webpack-dev-middleware";
import * as path from "path";
import WatchMissingNodeModulesPlugin from "../plugins/npm-auto-installer/missing-module";
import PackageInstaller from "../plugins/npm-auto-installer/installer";
import PackageInstallPlugin from "../plugins/npm-auto-installer";
import ReactComponentHighlighter from "../plugins/react-component-highlighter";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
var HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");

export class Compiler {
  private compiler: webpack.Compiler;

  constructor(expressApp: any, projectRoot: string) {
    this.compiler = webpack({
      entry: {
        inspector: [
          path.join(__dirname, "../inspector/inspector.ts"),
          "webpack-hot-middleware/client"
        ],
        main: [
          path.join(projectRoot, "index.jsx"),
          "webpack-hot-middleware/client"
        ]
      },
      mode: "development",
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"],
              plugins: [
                "react-hot-loader/babel",
                path.join(__dirname, "./babel-plugins/source-plugin.js"),
                //"@babel/plugin-transform-react-jsx-source",
                [
                  "babel-plugin-styled-components",
                  {
                    fileName: false
                  }
                ]
              ]
            }
          }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: "Config Pack",
          template: require("html-webpack-template"),
          appMountId: "root",
          inject: false
        }),
        new PackageInstallPlugin(new PackageInstaller(projectRoot)),
        new WatchMissingNodeModulesPlugin(
          path.join(projectRoot, "node_modules")
        ),
        new webpack.HotModuleReplacementPlugin(),
        new ReactComponentHighlighter(projectRoot),
        new WebpackBar()
        //  new ErrorOverlayPlugin()
      ]
    });

    expressApp.use(
      middleware(this.compiler, {
        publicPath: "/"
      })
    );

    expressApp.use(require("webpack-hot-middleware")(this.compiler));
  }
}
