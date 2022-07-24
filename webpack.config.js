const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const paths = require("./paths");

module.exports = {
  entry: [paths.src + "/index.js"],

  output: {
    path: paths.build,
    filename: "[name].bundle.js",
    publicPath: "/",
    assetModuleFilename: "images/[name].[ext]",
  },

  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // { test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i, type: "asset/resourse" },

      { test: /\.(?:ico|gif|png|jpg|jpeg|svg|)$/i, type: "asset/resource" },

      {
        test: /\.(css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
        ],
      },
    ],
  },

  resolve: {
    modules: [paths.src, "node_modules"],
    alias: {
      "@": paths.src,
      assets: paths.public,
    },
  },
};
