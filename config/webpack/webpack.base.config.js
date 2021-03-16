const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolveFromRoot } = require('../utils');
const { getAppEnv, getCssLoaders, getSassLoaders } = require('./utils');
const { componentsPath, cssModulesPaths, sassResources } = require('./constants');


module.exports = (env, argv = {}, mode) => {
  const { webpackDotEnvSettings, publicUrl } = getAppEnv(argv, mode, env);
  const isDevMode = mode !== 'production';

  return {
    entry: {
      app: resolveFromRoot('app/index.tsx'),
    },
    output: {
      path: resolveFromRoot('build'),
      filename: isDevMode ? 'js/[name].js' : 'js/[name].[contenthash].js',
      chunkFilename: isDevMode ? 'js/[name].js' : 'js/[name].[chunkhash].js',
      publicPath: publicUrl,
    },
    plugins: [
      new webpack.DefinePlugin(webpackDotEnvSettings),
      new HtmlWebpackPlugin({
        template: resolveFromRoot('app/index.html'),
      }),
    ],
    optimization: {
      noEmitOnErrors: true,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          react: {
            test: /react/,
            chunks: 'all',
            name: 'react',
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
            minChunks: 1,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 20,
          },
        },
      },
    },
    resolveLoader: {
      modules: [
        resolveFromRoot('node_modules'),
        path.resolve(__dirname, 'custom-loaders'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        {
          test: /\.css$/,
          exclude: cssModulesPaths,
          use: getCssLoaders({ isDevMode, modules: false }),
        },
        {
          test: /\.s[ac]ss$/,
          exclude: cssModulesPaths,
          use: getSassLoaders({ isDevMode, resources: sassResources, modules: false }),
        },
        {
          test: /\.s[ac]ss$/,
          include: cssModulesPaths,
          use: getSassLoaders({ isDevMode, resources: sassResources, modules: true }),
        },
        {
          test: /\.svg$/,
          include: componentsPath,
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
        {
          test: /\.(jpe?g|gif|png|svg)$/,
          exclude: componentsPath,
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: 'url-loader',
        },
        {
          test: /react-dates-fns/,
          loader: 'react-dates-fns-loader',
          options: {
            locales: ['ru'],
          },
        },
      ],
    },
    resolve: {
      modules: [
        'app',
        'node_modules',
      ],
      extensions: [
        // web-specific module implementations should be written in files using the extension '.web.ts(x)'.
        '*', // TODO: выпилить
        '.web.ts', // TODO: выпилить
        '.web.tsx', // TODO: выпилить
        '.web.js', // TODO: выпилить
        '.ts',
        '.tsx',
        '.js',
      ],
      mainFields: ['jsnext:main', 'main'],
    },
  };
};
