const webpack = require('webpack');
const resolve = require('path').resolve;
const path = require('path')

const config = {
 devtool: 'eval-source-map',
 entry: __dirname + '/js/index.jsx',
 output:{
      path: resolve('../public'),
      filename: 'bundle.js',
      publicPath: resolve('../public')
},
 resolve: {
  extensions: ['.js','.jsx','.css'],
  alias: {
        'semantic-ui': path.join(__dirname, "node_modules", "semantic-ui-css", "semantic.min.js"),
  }
 },
 module: {
  rules: [
  {
   test: /\.jsx?/,
   loader: 'babel-loader',
   exclude: /node_modules/
  },
  {
         test: /\.css$/,
         loader: 'style-loader!css-loader?modules'
  },
  {
      test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
      loader: 'url-loader?limit=100000' },
  ]
 }
};
module.exports = config;
