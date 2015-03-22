var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var template = require('gulp-dot-precompiler');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var stylish = require('jshint-stylish');
var mergeStream = require('merge-stream');
var header = require('gulp-header');
var footer = require('gulp-footer');
var nib = require('nib');

var paths = {
  js: 'src/jquery.404found.js',
  wrapper: 'src/wrapper.js',
  stylus: 'src/jquery.404found.styl',
  templates: 'src/templates/*.html',
  dest: 'dist',
  destJs: 'jquery.404found.js'
};

var tasks = {
  js: function() {
    var js = gulp.src(paths.js);
    var templates = gulp.src(paths.templates)
      .pipe(template({
        dictionary: 'templates',
        varname: 'data'
      }))
      // First concat all compiled template files ond add header
      .pipe(concat(paths.destJs))
      .pipe(header('var templates = {};\n'));
    // then merge streams and concat javascript source with templates and add wrapper
    return mergeStream(templates, js)
      .pipe(concat(paths.destJs))
      .pipe(footer('return $.found;\n'))
      .pipe(wrap({src: paths.wrapper}));
  },
  stylus: function(compress) {
    var options = {use: nib(), import: ['nib'], compress: compress};
    return gulp.src(paths.stylus)
        .pipe(stylus(options));
  }
};

gulp.task('js', function() {
  return tasks.js().pipe(gulp.dest(paths.dest));
});

gulp.task('js:min', function() {
  return tasks.js().pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('stylus', function() {
  return tasks.stylus()
    .pipe(gulp.dest(paths.dest));
});

gulp.task('stylus:min', function () {
  return tasks.stylus(true)
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['lint', 'js']);
  gulp.watch(paths.templates, ['js']);
  gulp.watch(paths.stylus, ['stylus']);
});

gulp.task('build', ['lint', 'js', 'js:min', 'stylus', 'stylus:min']);

gulp.task('default', ['build']);
