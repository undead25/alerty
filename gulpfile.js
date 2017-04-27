const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript')
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const header = require('gulp-header');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const backgroundRgba = require('postcss-background-alpha');
const colorRgba = require("postcss-color-rgba-fallback");
// const browserSync = require('browser-sync').create();
const pkg = require('./package.json');

const banner = [
  '/*!',
  ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
  ' * Licensed under the <%= pkg.license %> license',
  ' */',
  ''].join('\n')


gulp.task('styles', function () {
  gulp.src('./src/alerty.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 35',
        'Firefox >= 31',
        'Explorer >= 8',
        'iOS >= 7',
        'Opera >= 12',
        'Safari >= 7.1'
      ],
      cascade: false
    }))
    .pipe(postcss([
      backgroundRgba,
      colorRgba({
        properties: ["color", "border", "border-color"]
      })
    ]))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./lib'))
    .pipe(cleancss({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('scripts', () => {
  return rollup.rollup({
    entry: "./src/alerty.ts",
    plugins: [
      typescript(),
      resolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ],
  }).then((bundle) => {
    bundle.write({
      format: "umd",
      moduleName: "alerty",
      dest: "./lib/alerty.min.js",
      sourceMap: true
    });
  })
});

gulp.task('default', ['scripts', 'styles']);
