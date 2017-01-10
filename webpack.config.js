const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = {
  devtool: 'source-map',
  entry: {
    filename: './assets/scripts/src/main.js',
  },
  output: {
    filename: 'assets/scripts/dist/main.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            ['es2015', { modules: false }],
          ],
        },
      },
      {
        test: /[\/\\]node_modules[\/\\]lazysizes[\/\\]lazysizes\.js$/,
        // loader: 'imports?this=>window',
        loader: 'imports?define=>false',
      },
      {
        test: /[\/\\]node_modules[\/\\]smooth-scroll[\/\\]dist[\/\\]js[\/\\]smooth-scroll\.js$/,
        // loader: 'imports?this=>window',
        loader: 'imports?define=>false',
      },
      {
        test: /[\/\\]node_modules[\/\\]imagesloaded[\/\\]imagesloaded\.pkgd\.min\.js$/,
        // loader: 'imports?this=>window',
        loader: 'imports?define=>false',
      },
      {
        test: /[\/\\]assets[\/\\]scripts[\/\\]src[\/\\]imagesloaded[\/\\]modules[\/\\]image-grid-effects\.js$/,
        loader: 'imports?this=>window',
        // loader: 'imports?define=>false',
      },
    ],
  },
  plugins: [
    // uglify js
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true,
    }),

    // provide plugin - inject implicit globals
    new webpack.ProvidePlugin({
      Modernizr: 'Modernizr',
      imagesloaded: 'imagesloaded',
    }),

    // env plugin
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
    }),
  ],
};
