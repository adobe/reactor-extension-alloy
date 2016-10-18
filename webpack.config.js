'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const argv = require('yargs').argv;
const webpack = require('webpack');
const pkg = require('./package.json');

const entries = {
  extensionConfiguration: './src/view/extensionConfiguration/index.js',
  sendBeacon: './src/view/actions/sendBeacon/index.js',
  setVariables: './src/view/actions/setVariables/index.js'
};

const plugins = Object.keys(entries).map(chunkName => (
  new HtmlWebpackPlugin({
    chunks: [chunkName],
    filename: chunkName + '.html',
    template: 'src/view/template.html'
  })
));

const reactVersion = pkg.dependencies['react'];
const reactDOMVersion = pkg.dependencies['react-dom'];

plugins.push(
  new HTMLWebpackExternalsPlugin([
    {
      name: 'react',
      var: 'React',
      url: `//unpkg.com/react@${reactVersion}/dist/react${argv.production ? '.min' : ''}.js`
    },
    // If we load react from a CDN, we have to do the same for react-dom without janky business. :(
    // https://github.com/webpack/webpack/issues/1275#issuecomment-176255624
    {
      name: 'react-dom',
      var: 'ReactDOM',
      url: `//unpkg.com/react-dom@${reactDOMVersion}/dist/react-dom${argv.production ? '.min' : ''}.js`
    }
  ])
);

if (argv.production) {
  plugins.push(
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
