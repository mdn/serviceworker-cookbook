const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const glob = require('glob');
const path = require('path');

const ignore = ['!./dist', '!./dist/**', '!./node_modules', '!./node_modules/**'];
const recipes = glob.sync('./!(dist|node_modules)/').map(function toBase(dir) {
  return path.basename(dir);
});
const srcRecipes = recipes.map(function makePath(name) {
  return './' + name + '/*';
});

gulp.task('clean', function clean(done) {
  del(['./dist']).then(function delThen() {
    done();
  });
});

gulp.task('lint', function lint() {
  return gulp
    .src(['./*.js', './*/*.js'].concat(ignore))
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('build:docs', ['clean'], function buildDocs() {
  return gulp
    .src(srcRecipes, {
      base: './',
    })
    .pipe(plugins.docco())
    .pipe(gulp.dest('./dist/docs'));
});

gulp.task('build:index', ['clean'], function buildIndex() {
  return gulp
    .src('index.html')
    .pipe(plugins.swig({
      data: {
        package: require('./package.json'),
        recipes: recipes,
        ghBase: 'https://github.com/digitarald/serviceworker-cookbook/blob/master/',
      },
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:recipes', ['clean'], function buildRecipes() {
  return gulp
    .src(srcRecipes, {
      base: './',
    })
    .pipe(gulp.dest('./dist'));
});

// Start express server after building site
gulp.task('start-server', ['build'], function startServer(cb) {
  require('./server.js').ready.then(cb);
});

// Watch files and reloads BrowserSync
gulp.task('watch', ['start-server'], function serve() {
  const browserSync = require('browser-sync').create();
  browserSync.init(null, {
    proxy: 'http://localhost:3003',
    files: './*/*.js',
    open: false,
  });
  gulp.watch(['./*/*'].concat(ignore), ['build-dev'], browserSync.reload);
});

gulp.task('test', ['lint']);

// Minimal build tasks for speedy development
gulp.task('build-dev', ['build:recipes', 'test']);

// Full build for publishing
gulp.task('build', ['build:index', 'build:recipes', 'build:docs']);
