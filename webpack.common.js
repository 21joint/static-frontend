const path = require('path');
const glob = require('glob')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const getNameFromDir = (dir) => {
  const lastSlash = dir.lastIndexOf('/')
  return dir.slice(lastSlash + 1)
}

const generateHTMLPlugins = () =>
  glob.sync('./src/**/*.html').map(dir =>
    new HTMLWebpackPlugin({
      filename: getNameFromDir(dir), // Output
      template: dir, // Input
    }))

module.exports = {
  node: {
    fs: 'empty',
  },
  entry: {
    main: [
      './src/js/entry.js',
      './src/stylesheets/styles.scss'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        },
      },
      {
        test: /(?!_)\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(
          ['css-loader', 'postcss-loader', 'sass-loader']),
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {
        from: './src/images/',
        to: './images/',
      }, {
        from: './src/fonts/',
        to: './fonts/',
      }]),
    ...generateHTMLPlugins(),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
}
