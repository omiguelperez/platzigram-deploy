'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const browserify = require('browserify')
const babel = require('babelify')
const source = require('vinyl-source-stream')
const watchify = require('watchify')

gulp.task('styles', () => {
  gulp
    .src('index.scss')
    .pipe(sass())
    .pipe(rename('app.css'))
    .pipe(gulp.dest('public'))
})

gulp.task('assets', () => {
  gulp
    .src('assets/**')
    .pipe(gulp.dest('public'))
})

gulp.task('libs', () => {
  gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/materialize-css/dist/js/materialize.min.js'
    ])
    .pipe(gulp.dest('public'))
})

function compile (watch) {
  let bundle = browserify('./src/index.js')

  function rebundle () {
    bundle
      .transform(babel.configure({ 
        presets: ['es2015'],
        plugins: ['transform-regenerator']
      }))
      .bundle()
      .on('error', function (err) { console.log(err); this.emit('end') })
      .pipe(source('index.js'))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('public'))
  }

  if (watch) {
    bundle = watchify(bundle)
      .on('update', () => {
        console.log('--> Building...')
        rebundle()
      })
  }

  rebundle()
}

gulp.task('build', () => compile())

gulp.task('watch', () => compile(true))

gulp.task('default', ['styles', 'assets', 'libs', 'build'])
