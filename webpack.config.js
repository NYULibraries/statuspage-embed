const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

module.exports = (env) => {
  return {
    context: path.resolve(__dirname),
    entry: {
      index: [
        './js/index.js',
        './scss/index.scss',
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].min.js',
    },
    devtool: isProduction || isStaging ? 'source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].min.css',
              },
            },
            {
              loader: 'extract-loader',
            },
            {
              loader: 'css-loader',
              options: {
                url: true,
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'DEPLOY_ENV': JSON.stringify(env.DEPLOY_ENV)
        },
      }),
    ],
  };
};
