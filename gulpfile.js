var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var template = require('gulp-dot-precompiler');
var uglify = require('gulp-uglify');
var umd = require('gulp-umd');
var wrap = require('gulp-wrap');
var stylish = require('jshint-stylish');
var mergeStream = require('merge-stream');
var nib = require('nib');

var paths = {
  js: ['src/util.js', 'src/comebackhome.js'],
  cssWrapper: 'src/injectCSS.js',
  stylus: 'src/comebackhome.styl',
  templates: 'src/templates/*.html',
  dest: 'dist',
  destJs: 'comebackhome.js'
};

var tasks = {
  js: function() {
    return gulp.src(paths.js);
  },
  templates: function() {
    return gulp.src(paths.templates)
      .pipe(template({
        dictionary: 'templates',
        varname: 'data'
      }))
      // concat all compiled template files ond add header
      .pipe(concat(paths.destJs))
      .pipe(header('var templates = {};'))
  },
  combine: function() {
    // merge streams into 1 javascript source and add wrapper
    return mergeStream.apply(null, arguments)
      .pipe(concat(paths.destJs))
      .pipe(umd({
        exports: function() {
          return 'comebackhome';
        }
      }));
  },
  stylus: function(compress) {
    var options = {use: nib(), import: ['nib'], compress: compress};
    return gulp.src(paths.stylus)
        .pipe(stylus(options));
  },
  injectCSS: function(compress) {
    return tasks.stylus(true)
      .pipe(wrap({src: paths.cssWrapper}))
  }
};

gulp.task('js', function() {
  return tasks.combine(tasks.templates(), tasks.js()).pipe(gulp.dest(paths.dest));
});

gulp.task('js:min', function() {
  return tasks.combine(tasks.templates(), tasks.js())
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('bundle', function() {
  return tasks.combine(tasks.templates(), tasks.js(), tasks.injectCSS())
    .pipe(uglify())
    .pipe(rename({extname: '.bundle.min.js'}))
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
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['lint', 'js', 'bundle']);
  gulp.watch(paths.templates, ['js', 'bundle']);
  gulp.watch(paths.stylus, ['stylus', 'bundle']);
});

gulp.task('build', ['lint', 'js', 'js:min', 'stylus', 'stylus:min', 'bundle']);

gulp.task('default', ['build', 'watch']);
