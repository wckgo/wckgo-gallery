"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const production = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Ray Tracing | wckgo",
      template: "public/index.html",
    })
  ],
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ]
  }
};
