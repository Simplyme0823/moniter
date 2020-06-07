const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  entryFiles.map((entryFile) => {
    const match = entryFile.match(/src\/(.*)\/index.js/);
    const pageName = match && match[1];
    if (pageName !== "monitor") {
      entry[pageName] = entryFile;
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: [pageName],
          inject: "head", //注入头部是要先执行监控脚本
          minify: {
            html5: true,
            collapseWhitespace: false,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
          },
        })
      );
    }
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "monitor.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: { compact: false },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ["build"] }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    stats: "errors-only",
    //express服务器
    before(router) {
      router.get("/success", function (req, res) {
        res.json({ id: 1 });
      });
      router.post("/error", function (req, res) {
        res.sendStatus(500);
      });
    },
  },
};
