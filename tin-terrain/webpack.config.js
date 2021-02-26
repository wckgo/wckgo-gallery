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
  // devtool: production ? "none" : "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "TIN Terrain | wckgo",
      template: "public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: __dirname + "/public/assets",
          to: __dirname + "/dist/assets",
        },
      ],
    }),
  ]
};
