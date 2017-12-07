const Webpack = require("Webpack");
const Path = require("path");
const HtmlWebpackPlugin = require("html-Webpack-plugin");
const ExtractTextPlugin = require("extract-text-Webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const outPath = Path.join(__dirname, "./build/app");
const sourcePath = Path.join(__dirname, "./src/app");
const hotMiddleware = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

module.exports = {
  entry: {
    pay: [
      "react-hot-loader/patch",
      hotMiddleware,
      Path.join(sourcePath, "pay", "browser.tsx")
    ],
    vendor: [
      "react",
      "react-dom",
      "react-redux",
      "react-router",
      "redux",
      hotMiddleware
    ]
  },
  devtool: "source-map",
  target: "web",
  output: {
    filename: "[name].bundle.js",
    path: outPath,
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".scss"],
    mainFields: ["browser", "main"]
  },
  module: {
    rules: [{
      test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: "url-loader?limit=100000"
    }, {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: [ sourcePath ]
    }, {
      test: /\.less$/,
      use: ["style-loader", "css-loader", "less-loader"],
      exclude: /node_modules/
    }, {
      test: /\.tsx?$/,
      use: isProduction
        ? "awesome-typescript-loader?module=es6"
        : [
          "react-hot-loader/webpack",
          "awesome-typescript-loader"
        ]
    }]
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin(),
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": isProduction === true ? JSON.stringify("production") : JSON.stringify("development")
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
      minChunks: Infinity
    }),
    new Webpack.optimize.AggressiveMergingPlugin()
  ],
  node: {
    fs: "empty",
    net: "empty"
  },
  devServer: {
    host: "localhost",
    port: 8000,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true
    // enable HMR on the server
  }
};
