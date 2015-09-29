const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const glob = require('glob');
const path = require('path');
const browserSync = require('browser-sync').create();

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
    .pipe(plugins.eslint.format());
});

gulp.task('build:docs', ['clean', 'lint'], function buildDocs() {
  return gulp
    .src(srcRecipes, {
      base: './',
    })
    .pipe(plugins.docco())
    .pipe(gulp.dest('./dist/docs'));
});

gulp.task('build:index', ['clean', 'lint'], function buildIndex() {
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

gulp.task('build:recipes', ['clean', 'lint'], function buildRecipes() {
  return gulp
    .src(srcRecipes, {
      base: './',
    })
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', ['build-dev'], function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch(['./*/*'].concat(ignore), ['build-dev'], browserSync.reload);
});

gulp.task('build-dev', ['build:recipes']);

gulp.task('build', ['build:index', 'build:recipes', 'build:docs']);
