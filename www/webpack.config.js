'use strict';
var webpack = require('webpack');

var path = require('path');
var resolve = require.resolve;

var resolveFromHere = path.resolve.bind(path, __dirname);
var resolveModuleDir = resolveFromHere.bind(path, 'node_modules');

var jsLoader = resolve('babel-loader');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
}

var plugins = [
  new webpack.PrefetchPlugin('react'),
  new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
  new webpack.DefinePlugin({
    'process.env': Object.keys(process.env).reduce(function(o, k) {
      o[k] = JSON.stringify(process.env[k]);
      return o;
    }, {}),
    '__DEV__': process.env.NODE_ENV === 'development'
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      exclude: /third\-party/
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}

var entryPath = resolveFromHere('index.js');

var destPath = (
  resolveFromHere(
    (
      process.env.NODE_ENV === 'production' ?
        'dist' :
        'build'
    )
  )
);

module.exports = {
  entry: [ entryPath ],
  cache: true,
  context: path.join(__dirname, 'app'),
  node: {
    __filename: true
  },
  output: {
    path: destPath,
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: plugins,
  resolve: {
    fallback: resolveModuleDir(),
    alias: {
      'base': resolveFromHere('baseComponents'),
      'eventPlugins': resolveFromHere('Libraries/vendor/eventPlugins'),
      'zynga': resolveFromHere('Libraries/vendor/zynga'),
      'react': resolveModuleDir('react')
    }
  },
  resolveLoader: { fallback: resolveModuleDir() },
  module: {
    loaders: [
      {
        test: /.*\.js$/,
        exclude: /node\_modules/,
        loader: jsLoader + '?stage=0&optional=runtime&compact=false'
      }
    ]
  }
};
