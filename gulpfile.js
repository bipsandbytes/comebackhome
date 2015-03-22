'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');

var paths = {
  js: 'src/jquery.404found.js',
  stylus: 'src/jquery.404found.styl',
  dest: 'dist'
};

gulp.task('js', function() {
  return gulp.src(paths.js).pipe(gulp.dest(paths.dest));
});

gulp.task('js:min', function() {
  return gulp.src(paths.js)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('stylus', function() {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('stylus:min', function () {
  return gulp.src(paths.stylus)
    .pipe(stylus({
      compress: true
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('build', ['lint', 'js', 'js:min', 'stylus', 'stylus:min']);
gulp.task('default', ['build']);
