const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    index: [
      './js/index.js',
      './scss/index.scss',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
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
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader?-url'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
    ],
  },
};
