// Library
const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const webpack = require("webpack");

require("dotenv").config();

const webpackConfig = config => {
  config.plugins.push(new webpack.EnvironmentPlugin(process.env));
  return config;
};

const plugins = [withImages];

const config = {
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]--[hash:base64:5]",
    ignoreOrder: true
  },
  webpack: webpackConfig
};

module.exports = withPlugins(plugins, config);
