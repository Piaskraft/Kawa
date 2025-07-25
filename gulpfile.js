const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const { deleteAsync } = require('del');

// Ścieżki
const paths = {
  html: 'src/index.html',
  js: 'src/js/**/*.js',
scss: 'src/sass/**/*.scss',
  images: 'src/images/**/*',
  dist: 'dist',
};

// Zadania
function htmlTask() {
  return src(paths.html).pipe(dest(paths.dist));
}

function jsTask() {
  return src(paths.js).pipe(dest(`${paths.dist}/js`));
}

function scssTask() {
  return src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(`${paths.dist}/css`)) // 👈 TO JEST KLUCZ
    .pipe(browserSync.stream());
}


function imageTask() {
  return src(paths.images).pipe(dest(`${paths.dist}/images`));
}

function cleanDist() {
  return deleteAsync([paths.dist]);
}

// Inicjalizacja projektu
function init(done) {
  series(cleanDist, parallel(htmlTask, jsTask, scssTask, imageTask))(done);
}

// Serwer + watcher
function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
  });

  watch(paths.html, htmlTask).on('change', browserSync.reload);
  watch(paths.js, jsTask).on('change', browserSync.reload);
  watch('src/sass/**/*.scss', scssTask);
  watch(paths.images, imageTask).on('change', browserSync.reload);
}

// Eksporty
exports.default = series(
  cleanDist,
  parallel(htmlTask, jsTask, scssTask, imageTask),
  serve
);

exports.init = init;
exports.watch = series(init, serve);
exports.htmlTask = htmlTask;
exports.jsTask = jsTask;
exports.scssTask = scssTask;
exports.imageTask = imageTask;
