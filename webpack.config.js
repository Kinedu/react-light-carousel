/*** webpack.config.js ***/
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "examples/src/index.html"),
    filename: "./index.html"
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: "[name].css",
  chunkFilename: "[id].css"
});

module.exports = {
  entry: path.join(__dirname, "examples/src/index.js"),
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js($|\?)/i
      })
    ]
  },
  plugins: [htmlWebpackPlugin, miniCssExtractPlugin],
  externals: {
    // react: {
    //     commonjs: "react",
    //     commonjs2: "react",
    //     amd: "React",
    //     root: "React"
    // },
    // "react-dom": {
    //     commonjs: "react-dom",
    //     commonjs2: "react-dom",
    //     amd: "ReactDOM",
    //     root: "ReactDOM"
    // }
}
}