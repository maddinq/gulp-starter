/*
 * Gulp-Worker
 * Version: 2.0.0
 * Author: Martin Quade
*/
///////////////////////////////
// Requiered Gulp Plugins
///////////////////////////////
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    browserSync = require("browser-sync").create(),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    scsslint = require('gulp-scss-lint'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    notify = require("gulp-notify"),
    revts = require('gulp-rev-timestamp'),
    del = require('del');

///////////////////////////////
// Definition of paths
///////////////////////////////
var projectInputPath = 'app',
    projectOutputPath = 'public',
    paths = {
      base: projectOutputPath + '/',
      cssOutputFolder: projectOutputPath + '/css/',
      scssInputFolder: projectInputPath + '/scss/',
      jsInputFolder: projectInputPath + '/js/',
      jsOutputFolder: projectOutputPath + '/js/',
      tmplInputFolder: projectInputPath + '/',
      tmplOutputFolder: projectOutputPath + '/',
      imgInputFolder: projectInputPath + '/images/',
      imgOutputFolder: projectOutputPath + '/images/',
      fontsInputFolder: projectInputPath + '/fonts/',
      fontsOutputFolder: projectOutputPath + '/fonts/'
    };

// Debug file or pathauto `gulp debug:fileorpath`
var testPathOrFile = paths.tmplInputFolder + '*';
gulp.task('debug:path', function() {
  gulp.src(testPathOrFile)
  .pipe(notify("Found file: <%= file.relative %>"));
});

///////////////////////////////
// Styles Tasks
///////////////////////////////
gulp.task('scss', function() {
  gulp.src(paths.scssInputFolder + '*.scss')
  .pipe(scsslint())
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 2 version', 'ie 9', 'ie 10',  'Android 4.4']}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(paths.cssOutputFolder))
  .pipe(browserSync.stream());
});
///////////////////////////////
// Script Tasks
///////////////////////////////
gulp.task('js', function(){
  gulp.src([paths.jsInputFolder + '**/*.js', '!'+ paths.jsInputFolder +'**/*.min.js'])
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish', {beep: true}))
  .pipe(gulp.dest(paths.jsOutputFolder))
  .pipe(browserSync.stream());
});

gulp.task('jsLibs', function(){
  gulp.src([paths.jsInputFolder + '**/*.min.js'])
  .pipe(gulp.dest(paths.jsOutputFolder));
});

///////////////////////////////
// HTML Tasks
///////////////////////////////
gulp.task('html', function() {
  gulp.src(paths.tmplInputFolder + '*.html')
  .pipe(revts())
  .pipe(gulp.dest(paths.tmplOutputFolder))
  .pipe(browserSync.stream());
});

///////////////////////////////
// Image Tasks
///////////////////////////////
gulp.task('images', function() {
  gulp.src(paths.imgInputFolder + '*.*')
  .pipe(gulp.dest(paths.imgOutputFolder));
});

///////////////////////////////
// Fonts Tasks
///////////////////////////////
gulp.task('fonts', function(){
  //gulp.src([paths.fontsInputFolder + '**/*'])
  //.pipe(gulp.dest(paths.fontsOutputFolder));
});

///////////////////////////////
// Cleanup Dist Folder
///////////////////////////////
gulp.task('cleanupDist', function(cb) {
  return del.sync([paths.tmplOutputFolder]);
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////
// Serve Task with Browser-Sync Tasks
///////////////////////////////
gulp.task('serve', ['devWorker'], function() {

    browserSync.init({
        server: "./public/"
    });

    gulp.watch(paths.scssInputFolder + '**/*.scss', ['scss']);
    gulp.watch(paths.jsInputFolder + '**/*.js', ['js']);
    gulp.watch(paths.tmplInputFolder + '*.html'), ['html'];
    gulp.watch(paths.dataInputFolder + '**/*', ['data']).on('change', browserSync.reload);
    gulp.watch(paths.imgInputFolder + '*.*', ['images']).on('change', browserSync.reload);
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////
// Build: SCSS Tasks
///////////////////////////////
gulp.task('build:scss', function() {
  gulp.src(paths.scssInputFolder + '*.scss')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 2 version', 'ie 9', 'ie 10',  'Android 4.4']}))
  .pipe(sourcemaps.write('./maps'))
  //.pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest(paths.cssOutputFolder))
  .pipe(notify({ message: 'Build scss task: complete' }));
});

///////////////////////////////
// Build: Script Tasks
///////////////////////////////
gulp.task('build:js', function(){
  gulp.src([paths.jsInputFolder + '**/*.js', '!'+ paths.jsInputFolder +'**/*.min.js'])
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish', {beep: true}))
  //.pipe(rename({suffix:'.min'}))
  .pipe(uglify())
  .pipe(gulp.dest(paths.jsOutputFolder))
  .pipe(notify({ message: 'Build JS task: complete' }));
});
///////////////////////////////
// GULP Runner
///////////////////////////////

// Watch Task

// default `gulp` task
gulp.task('default', ['cleanupDist', 'serve']);

// dev worker which starts all important tasks
gulp.task('devWorker',['html', 'scss', 'jsLibs', 'js', 'images', 'fonts']);

// builder with minify (css and js) files `gulp build`
gulp.task('build', ['cleanupDist','html', 'images', 'jsLibs', 'data', 'fonts', 'build:js', 'build:scss']);
