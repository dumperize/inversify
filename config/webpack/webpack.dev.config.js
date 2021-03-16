const { merge } = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const commonConfig = require('./webpack.base.config.js');
const { getAppEnv } = require('./utils');


const mode = 'development';
const stats = {
  builtAt: true,
  assets: false,
  chunks: false,
  modules: false,
  children: false,
  entrypoints: false,
};

module.exports = (env, argv = {}) => {
  const { baseStandUrl, aupdUrl } = getAppEnv(argv);
  return merge(commonConfig(env, argv, mode), {
    mode,
    stats,
    cache: true,
    devServer: {
      host: '127.0.0.1',
      port: 19333,
      historyApiFallback: true,
      hotOnly: true,
      overlay: true,
      open: true,
      clientLogLevel: 'silent',
      stats,
      proxy: {
        '**/api/**': {
          target: baseStandUrl,
          secure: true,
          changeOrigin: true,
        },
        '**/aupd/**': {
          target: aupdUrl,
          secure: true,
          changeOrigin: true,
          pathRewrite: { '^/aupd': '' },
        },
        '**/attachments/**': {
          target: baseStandUrl,
          secure: true,
          changeOrigin: true,
        },
        '**/external_apps/**': {
          target: baseStandUrl,
          secure: true,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
    ],
    devtool: 'eval-cheap-module-source-map',
  });
};
