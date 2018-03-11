const path = require('path')
const conf = require('./conf')
const glob = require('glob')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const getNameFromDir = (dir) => {
  const lastSlash = dir.lastIndexOf('/')
  return dir.slice(lastSlash + 1)
}

const generateHTMLPlugins = () =>
  glob.sync('./src/*.html').map(dir =>
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
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorOptions: {discardComments: {removeAll: true}},
      canPrint: true,
    }),
    new CopyWebpackPlugin([
      {
        from: './src/images/',
        to: './images/',
      }, {
        from: './src/fonts/',
        to: './fonts/',
      }]),
    new CleanWebpackPlugin(['dist']),
    ...generateHTMLPlugins(),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    port: 7777
  },
}
