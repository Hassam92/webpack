const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader','sass-loader'], publicPath: '/dist'})
const cssConfig = isProd ? cssProd : cssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: './src/app.js',
    bootstrap: bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/',
          'image-webpack-loader'
        ] 
      },
      { 
        test: /\.(woff2?|svg)$/,
        use: 'url-loader?limit=10000&name=fonts/[name].[ext]'
      },
      { 
        test: /\.(ttf|eot)$/,
        use: 'file-loader?&name=fonts/[name].[ext]'
      },
      { 
        test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        use: 'imports-loader?jQuery=jquery'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    stats: 'errors-only',
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Starter Project',
      hash: true,
      template: './src/index.html'
    }),
    new ExtractTextPlugin({
      filename: '/css/[name].css',
      disable: !isProd,
      allChunks: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    })
  ]
};