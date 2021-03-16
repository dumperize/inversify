/* eslint-disable @typescript-eslint/naming-convention */
const { getEnvironment } = require('lazy-universal-dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const getAppEnv = (webpackArgv, mode = 'development', env = {}) => {
  const stringifyMap = new Map(Object.entries(env));
  stringifyMap.forEach((item, key) => stringifyMap.set(key, JSON.stringify(item)));
  const stringifyObject = Object.fromEntries(stringifyMap.entries());
  const { webpack: webpackDotEnvSettings } = getEnvironment({ nodeEnv: mode });
  Object.assign(webpackDotEnvSettings['process.env'], { NODE_ENV: JSON.stringify(mode) });
  Object.assign(webpackDotEnvSettings['process.env'], stringifyObject);
  return {
    publicUrl: env.PUBLIC_URL || process.env.PUBLIC_URL,
    baseStandUrl: env.BASE_STAND_URL || process.env.BASE_STAND_URL,
    aupdUrl: env.AUPD_STAND_URL || process.env.AUPD_STAND_URL,
    webpackDotEnvSettings,
  };
};

const getCssLoaders = ({ isDevMode, modules }) => {
  return [
    isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDevMode,
        ...modules && {
          modules: {
            localIdentName: isDevMode ? '[folder]__[local]--[hash:base64:5]' : '[hash:base64]',
          },
        },
      },
    },
  ];
};

const getSassLoaders = ({ isDevMode, resources, modules }) => {
  return [
    ...getCssLoaders({ isDevMode, modules }),
    {
      loader: 'sass-loader',
      options: {
        sourceMap: isDevMode,
      },
    },
    {
      loader: 'sass-resources-loader',
      options: {
        resources,
      },
    },
  ];
};

module.exports = {
  getAppEnv,
  getCssLoaders,
  getSassLoaders,
};
