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

var webpackConfig = require('./webpack.config');

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

require('@reactor/extension-support-packager')(gulp, {
  dependencyTasks: ['buildView']
});

require('@reactor/extension-support-testrunner')(gulp);

var sandboxDependencyTasks = ['buildView'];
if (argv.watch && !argv.withoutWatch) {
  sandboxDependencyTasks.push('watch');
}

require('@reactor/extension-support-sandbox')(gulp, {
  dependencyTasks: sandboxDependencyTasks
});
