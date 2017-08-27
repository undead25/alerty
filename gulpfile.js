const gulp = require('gulp');
const rollup = require('rollup').rollup;
const typescript = require('rollup-plugin-typescript')
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const backgroundRgba = require('postcss-background-alpha');
const browserSync = require('browser-sync').create();

const packRollup = (options) => {
  let plugins = [
    typescript(),
    typescript(),
    babel({
      exclude: 'node_modules/**'
    }),
  ];
  if (options.minify) plugins.push(uglify());
  return rollup({
    entry: "./src/alerty.ts",
    plugins,
  }).then(bundle => {
    bundle.write({
      format: options.format,
      moduleName: "Alerty",
      dest: options.dest,
      footer: `window.alerty = new Alerty()`
    });
  })
}

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
    ]))
    .pipe(gulp.dest('lib'))
    .pipe(cleancss({ compatibility: 'ie8' }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('lib'));
});

gulp.task('prod', () => {
  return packRollup({
    dest: './lib/alerty.min.js',
    format: 'umd',
    minify: true
  })
});

gulp.task('dev', () => {
  return packRollup({
    dest: './lib/alerty.js',
    format: 'umd'
  })
});

gulp.task('watch', () => {
  gulp.watch('./src/*.ts', ['dev', 'prod']);
  gulp.watch('./src/*.scss', ['styles']);
  
})

gulp.task('server', () => {
  browserSync.init({
    files: ['./lib/**','./example/*.html'],
    port: '8888',
    server: {
      baseDir: ['./', 'example']
    }
  })
});

gulp.task('default', ['dev', 'prod', 'styles', 'server', 'watch']);
