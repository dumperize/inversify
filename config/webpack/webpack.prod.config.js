const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = require('./webpack.base.config.js');


const mode = 'production';

module.exports = (env, argv = {}) => {
  return merge(commonConfig(env, argv, mode), {
    mode,
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      }),
    ],
  });
};
