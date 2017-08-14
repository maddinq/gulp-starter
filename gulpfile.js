///////////////////////////////
// Requiered Gulp Plugins
///////////////////////////////
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    scsslint = require('gulp-scss-lint'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    notify = require("gulp-notify"),
    del = require('del');

///////////////////////////////
// Definition of paths
///////////////////////////////
var projectInputPath = 'app',
    projectOutputPath = 'dist',
    paths = {
      base: projectOutputPath + '/',
      cssOutputFolder: projectOutputPath + '/css/',
      scssInputFolder: projectInputPath + '/scss/',
      jsInputFolder: projectInputPath + '/js/',
      jsOutputFolder: projectOutputPath + '/js/',
      tmplInputFolder: projectInputPath + '/',
      tmplOutputFolder: projectOutputPath + '/',
      imgInputFolder: projectInputPath + '/images/',
      imgOutputFolder: projectOutputPath + '/images/'
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
  .pipe(browserSync.stream({match: '**/*.css'}));
});
///////////////////////////////
// Script Tasks
///////////////////////////////
gulp.task('js', function(){
  gulp.src([paths.jsInputFolder + '**/*.js', '!'+ paths.jsInputFolder +'**/*.min.js'])
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish', {beep: true}))
  .pipe(gulp.dest(paths.jsOutputFolder))
  .pipe(reload({stream: true}));
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
  .pipe(gulp.dest(paths.tmplOutputFolder));
});

///////////////////////////////
// Image Tasks
///////////////////////////////
gulp.task('images', function() {
  gulp.src(paths.imgInputFolder + '*.*')
  .pipe(gulp.dest(paths.imgOutputFolder));
});

///////////////////////////////
// Cleanup Dist Folder
///////////////////////////////
gulp.task('cleanupDist', function(cb) {
  del.sync([paths.tmplOutputFolder]);
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////
// Browser-Sync Tasks
///////////////////////////////
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: './dist/'
    }
  });
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
gulp.task('watch', function(){
  gulp.watch(paths.jsInputFolder + '**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch(paths.scssInputFolder + '**/*.scss', ['scss']).on('change', browserSync.reload);
  gulp.watch(paths.tmplInputFolder + '*.html', ['html']).on('change', browserSync.reload);
  gulp.watch(paths.imgInputFolder + '*.*', ['images']).on('change', browserSync.reload);
});

// default `gulp` task
gulp.task('default', ['cleanupDist','scss', 'jsLibs', 'js', 'html', 'images', 'watch', 'browser-sync']);

/*gulp.task('default', function () {
  runSequence('cleanupDist','scss', 'jsLibs', 'js', 'html', 'images', 'browser-sync','watch');
}); -> runSequence must be installed*/

// builder with minify (css and js) files `gulp build`
gulp.task('build', ['cleanupDist','html', 'images', 'jsLibs', 'build:js', 'build:scss']);
