// var autoprefixer      = require('autoprefixer');
// var precss            = require('precss');
var path      = require('path');
var BUILD_DIR = path.resolve(__dirname, 'public');

module.exports = {
  entry: [
    path.resolve(__dirname, 'src/index.jsx')
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['eslint'],
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test:   /\.css$/,
        exclude: /(node_modules|bower_components)/,
        loader: "style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader!postcss-loader"
      }
    ],
  },
  eslint: {
    configFile: `./.eslintrc`
  },
  // postcss: function () {
  //   return [autoprefixer];
  // },
  devServer: {
    colors: true,
    progress: true,
    historyApiFallback: true,
    port: 4000,
    contentBase: BUILD_DIR
  }
};
