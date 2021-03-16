const { merge } = require('webpack-merge');

const { resolveFromRoot, escapePathToImport } = require('../utils');
const webpackBaseConfig = require('../webpack/webpack.base.config');


module.exports = {
  stories: [
    escapePathToImport(resolveFromRoot('app/**/__stories__/*.tsx')),
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  webpackFinal: async (storybookConfig) => {
    const webpackConfig = webpackBaseConfig();

    return {
      ...storybookConfig,
      module: webpackConfig.module,
      resolve: merge(storybookConfig.resolve, webpackConfig.resolve),
      resolveLoader: merge(storybookConfig.resolveLoader, webpackConfig.resolveLoader),
    };
  },
};
