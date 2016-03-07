'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var argv = require('yargs')
  .default('watch', true)
  .alias('source-maps', 'with-source-maps')
  .argv;

// Shows an growl notification saying that building failed and then logs the error to the console.
var errorAlert = function(error) {
  notify.onError({
    title: 'Build Error',
    message: 'Check your terminal',
    sound: 'Sosumi'
  })(error);

  console.log(error.toString());

  this.emit('end');
};

var webpackConfig = {
  output: {
    filename: 'view.js'
  },
  devtool: argv.sourceMaps ? '#inline-source-map' : false,
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
        test: /\.pattern$/,
        include: /src\/view/,
        loader: 'style-loader!css-loader?sourceMap!stylus-loader!import-glob-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'styl'],
    // Needed when npm-linking projects like coralui-support-react
    // https://github.com/webpack/webpack/issues/784
    fallback: path.join(__dirname, 'node_modules')
  },
  stylus: {
    use: [require('nib')()],
    import: [
      path.resolve('./node_modules/nib/lib/nib/index')
    ]
  }
};

gulp.task('buildJS', function() {
  var stream = gulp.src('src/view/index.jsx')
    // Allows building to fail without breaking file watchers, etc.
    .pipe(plumber({ errorHandler: errorAlert }))
    .pipe(sourcemaps.init())
    .pipe(webpack(webpackConfig));

  if (argv.sourceMaps) {
    stream = stream.pipe(sourcemaps.write('.'));
  }

  return stream.pipe(gulp.dest('dist'));
});

gulp.task('copyHTML', function() {
  return gulp
    .src('src/view/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/view/**/*', ['buildJS']);
  gulp.watch('src/view/**/*.html', ['copyHTML']);
});

gulp.task('buildView', ['buildJS', 'copyHTML']);

require('@reactor/reactor-gulp-packager')(gulp, {
  dependencyTasks: ['buildView']
});

require('@reactor/reactor-gulp-testrunner')(gulp);

var sandboxDependencyTasks = ['buildView'];
if (argv.watch && !argv.withoutWatch) {
  sandboxDependencyTasks.push('watch');
}

require('@reactor/reactor-gulp-sandbox')(gulp, {
  dependencyTasks: sandboxDependencyTasks
});
