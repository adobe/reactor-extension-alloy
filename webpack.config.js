'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const argv = require('yargs').argv;
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const entries = {
  extensionConfiguration: './src/view/extensionConfiguration/index.js',
  sendBeacon: './src/view/actions/sendBeacon/index.js',
  setVariables: './src/view/actions/setVariables/index.js'
};

const plugins = Object.keys(entries).map(chunkName => (
  new HtmlWebpackPlugin({
    chunks: ['common', chunkName],
    filename: chunkName + '.html',
    template: 'src/view/template.html'
  })
));

// Split out common code from each view into a common file for caching gains.
// Split out common code from each view into a common file for caching gains.
plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'common',
  filename: 'common.js'
}));

if (argv.production) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

if (argv.runSandbox) {
  // This allows us to run the sandbox after the initial build takes place. By not starting up the
  // sandbox while simultaneously building the view, we ensure:
  // (1) Whatever we see in the browser contains the latest view files.
  // (2) The sandbox can validate our extension.json and find that the view files it references
  // actually exist because they have already been built.
  plugins.push(new WebpackShellPlugin({
    onBuildEnd: ['./node_modules/.bin/reactor-sandbox']
  }));
}

if (argv.analyze) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  entry: entries,
  plugins: plugins,
  output: {
    path: 'dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: /src\/view/,
        exclude: /__tests__/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.styl/,
        include: /src\/view/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'styl'],
    // Needed when npm-linking projects like coralui-support-react
    // https://github.com/webpack/webpack/issues/784
    fallback: path.join(__dirname, 'node_modules'),
    // When looking for modules, prefer the node_modules within this project. An example where
    // this is helpful: If this project requires in module X, we've npm linked module X and
    // module X has its node_modules populated, and module X requires React, typically two
    // copies of React would be bundled (one from this project's node_modules and one from
    // module X's node_modules). By setting this root, module X will prefer the React in this
    // project's node_modules, effectively de-duping React.
    // https://github.com/webpack/webpack/issues/966
    root: path.resolve(__dirname, 'node_modules')
  },
  stylus: {
    use: [require('nib')()],
    import: [
      path.resolve('~nib/lib/nib/index'),
      path.resolve('./src/view/units')
    ]
  }
};
