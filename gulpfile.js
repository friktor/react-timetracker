var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    del = require('del'),
    connect = require('connect'),
    static = require('serve-static');

var files = ['src/app.jsx'];

gulp.task('js', ['clean.js'], function() {
  var Compiler = babelify.configure({
    optional: [
      'es7.asyncFunctions',
      'es7.classProperties',
      'es7.comprehensions',
      'es7.decorators',
      'es7.exponentiationOperator',
      'es7.functionBind',
      'es7.objectRestSpread',
      'es7.trailingFunctionCommas',
      'es7.exportExtensions',

      'es6.spec.templateLiterals',
      'es6.spec.blockScoping',
      'validation.react',
      'es6.spec.symbols'
    ]
  })

  browserify(files)
    .transform(Compiler)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('build/'))
  ;
});

gulp.task('serve', function () {
  connect()
    .use(static('build', { index: 'index.html' }))
    .listen(1337)
});

gulp.task('watch', function() {
  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/**/*.jsx', ['js']);
});

gulp.task('html', ['clean.html'], function () {
  gulp.src('src/index.html').pipe(gulp.dest('build/'))
});

gulp.task('clean.html', function (done) { del(['build/index.html'], done) });
gulp.task('clean.js', function(done) { del(['build/bundle.js'], done) });

gulp.task('default', ['serve', 'watch', 'js', 'html']);
console.log('*********\nlisten on http://localhost:1337/\n*********');
