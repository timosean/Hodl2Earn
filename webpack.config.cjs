const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';
  const styleLoader = isProduction
    ? MiniCssExtractPlugin.loader
    : 'style-loader';

  return {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? 'assets/js/[name].[contenthash:8].js'
        : 'bundle.js',
      clean: true,
      publicPath: '/',
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.module\.scss$/i,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: false,
                  localIdentName: isProduction
                    ? '[hash:base64:8]'
                    : '[name]__[local]--[hash:base64:5]',
                },
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.scss$/i,
          exclude: /\.module\.scss$/i,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'public/index.html' }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'assets/css/[name].[contenthash:8].css',
            }),
          ]
        : []),
    ],
    devServer: {
      static: path.resolve(__dirname, 'public'),
      historyApiFallback: true,
      hot: true,
      port: 3000,
      open: false,
    },
  };
};
