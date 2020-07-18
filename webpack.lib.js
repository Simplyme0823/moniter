/** @format */

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    monitor: "./src/monitor/index.js",
    "monitor.min": "./src/monitor/index.js",
  },
  output: {
    filename: "[name].js",
    library: "monitor",
    libraryTarget: "umd",
    libraryExport: "default",
  },
  optimization: {
    minimize: true,
    minimizer: [
      //使用terserPlugin压缩 如果使用uglify遇到es6语法会报错（uglify3.0版本之后支持ES6压缩）
      new TerserPlugin({
        include: /\.min\.js$/,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
