
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var rgba = require('postcss-background-rgba');
var colorRgba = require("postcss-color-rgba-fallback");
var browserSync = require('browser-sync').create();

var config = {
  src: {
    css: './src/sass/alerty.scss',
    js: './src/scripts/alerty.js'
  },
  dist: {
    css: './dist/css',
    js: './dist/js',
    js: './'
  },
  autoprefix: {
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
  },
  ie8fix:[
    rgba,
    colorRgba({
      properties:["color", "border", "border-color"]
    })
  ],
  uglify: {
    mangle: true,
    compress: true
  },
  banner: [
    '/*!',
    ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %> <%= pkg.author %>',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''].join('\n')
};

gulp.task('sass', function() {
  gulp.src(config.src.css)
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer(config.autoprefix))
    .pipe(postcss(config.ie8fix))
    .pipe(header(config.banner, { pkg : pkg } ))
    .pipe(gulp.dest(config.dist.css))
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min' }))
    .pipe(gulp.dest(config.dist.css)); 
});

gulp.task('js', function() {
  gulp.src(config.src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(header(config.banner, { pkg : pkg } ))
    .pipe(gulp.dest(config.dist.js))
    .pipe(uglify(config.uglify))
    .pipe(header(config.banner, { pkg : pkg } ))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dist.js));
});

gulp.task('watch',['sass', 'js'], function() {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch(config.src.js, ['js']);
});

gulp.task('server', function() {
  browserSync.init({
    files: ['./dist/**','./example/*.html'],
    port: '8888',
    server: {
      baseDir: ['dist', 'example']
    }
  })
});

gulp.task('default',['sass', 'js', 'watch', 'server']);

