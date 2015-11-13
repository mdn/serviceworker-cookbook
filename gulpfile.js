var gulp = require('gulp');
var fs = require('fs');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var glob = require('glob');
var path = require('path');
var marked = require('marked');
var swig = require('swig');
var through2 = require('through2');
var promisify = require('es6-promisify');
var mergeStream = require('merge-stream');
var parseRecipes = require('./parseRecipes.js');
var renderFile = promisify(swig.renderFile);
var fsWriteFile = promisify(fs.writeFile);
var fsReadFile = promisify(fs.readFile);

var ignore = ['!./dist', '!./dist', '!./dist/**', '!./node_modules', '!./node_modules/**'];
var recipeSlugs = glob.sync('./!(dist|node_modules|src)/').map(function toBase(dir) {
  return path.basename(dir);
});
var srcRecipes = recipeSlugs.map(function makePath(name) {
  return './' + name + '/**';
});

var recipes = parseRecipes(recipeSlugs);

var template = (function() {
  function renderContent(content, options) {
    var newOptions = options || {};
    return renderFile('./src/tpl/layout.html', {
      content: content,
      package: require('./package.json'),
      recipes: recipes,
      ghBase: 'https://github.com/digitarald/serviceworker-cookbook/blob/master/',
      currentRecipe: newOptions.currentRecipe,
    });
  }

  /**
   * Write content into the layout file.
   * @param {string} outputFile - filename
   * @param {string} content - put in the main body, NOT ESCAPED
   * @param {Object} options -
   *    'currentRecipe' - if the page needs the recipe's header
   * @returns {Promise}
   */
  function writeFile(outputFile, content, options) {
    return renderContent(content, options)
    .then(function(output) {
      return fsWriteFile(outputFile, output);
    });
  }

  /**
   * Same as writeFile but works with streams
   * @returns Stream transform.
   */
  function transform(options) {
    return through2.obj(function(file, enc, next) {
      var self = this;
      renderContent(file.contents.toString('utf8'), options)
      .then(function(output) {
        file.contents = new Buffer(output);
        self.push(file);
        next();
      });
    });
  }

  return {
    transform: transform,
    writeFile: writeFile
  };
})();

gulp.task('clean', function clean(done) {
  del(['./dist']).then(function delThen() {
    fs.mkdir('./dist', function() {
      done();
    });
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
  var streams = recipes.map(function(recipe) {
    return gulp
    .src(recipe.srcs.map(function(src) {
      return recipe.slug + '/' + src.filename;
    }), {
      base: './'
    })
    .pipe(plugins.docco({
      template: './src/tpl/docco/docco.jst'
    }))
    .pipe(template.transform({ currentRecipe: recipe }))
    .pipe(plugins.rename(function(renamePath) {
      renamePath.dirname = '';
      renamePath.basename = recipe.slug + '_' + renamePath.basename + '_doc';
    }))
    .pipe(gulp.dest('./dist/'));
  });

  return mergeStream.apply(null, streams);
});

gulp.task('build:index', ['clean'], function buildIndex() {
  var intros = recipeSlugs.map(function(recipe) {
    var tokens = marked.lexer(fs.readFileSync(recipe + '/README.md', 'utf8'));
    if (tokens.length < 2 || tokens[0].type !== 'heading' || tokens[1].type !== 'paragraph') {
      console.error('Recipe: ' + recipe + ' must have title and summary');
      return null;
    }
    var title = tokens[0].text.substr(8);
    var summary = [tokens[1]];
    summary.links = tokens.links;
    return {
      slug: recipe,
      title: title,
      summary: marked.parser(summary),
    };
  });
  return renderFile('./src/tpl/index.html', { recipes: intros })
  .then(function(output) {
    return template.writeFile('./dist/index.html', output);
  });
});

gulp.task('build:intros', ['clean'], function() {
  return Promise.all(recipes.map(function(recipe) {
    return fsReadFile(recipe.slug + '/README.md', 'utf8')
    .then(function(readme) {
      return renderFile('./src/tpl/intro.html', { markdown: marked(readme) });
    })
    .then(function(content) {
      return template.writeFile('./dist/' + recipe.slug + '.html', content, { currentRecipe: recipe });
    });
  }));
});

gulp.task('build:demos', ['clean'], function() {
  return Promise.all(recipes.map(function(recipe) {
    return renderFile('./src/tpl/demo.html', { recipe: recipe })
    .then(function(output) {
      return template.writeFile('./dist/' + recipe.slug + '_demo.html', output, { currentRecipe: recipe });
    });
  }));
});

gulp.task('build:recipes', ['clean'], function() {
  return gulp
    .src(srcRecipes, {
      base: './'
    })
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:css', ['clean'], function() {
  return gulp
    .src([
      'src/css/foundation.normalize.css',
      'src/css/foundation.css',
      'src/css/foundation-icons.css',
      'src/css/style.css',
      'src/css/docco.css'
    ])
    .pipe(plugins.concat('bundle.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:js', ['clean'], function() {
  return gulp
    .src('src/js/*.js')
    .pipe(plugins.concat('bundle.js'))
    .pipe(gulp.dest('./dist'));
});

// Start express server after building site
gulp.task('start-server', ['build'], function startServer(cb) {
  require('./server.js').ready.then(cb);
});

// Watch files and reloads BrowserSync
gulp.task('watch', ['start-server'], function serve() {
  var browserSync = require('browser-sync').create();
  browserSync.init(null, {
    proxy: 'http://localhost:3003',
    files: './*/*.js',
    open: false
  });
  return gulp.watch(['./*/*'].concat(ignore), ['build-dev'], browserSync.reload);
});

gulp.task('test', ['lint']);

// Minimal build tasks for speedy development
gulp.task('build-dev', ['build:recipes', 'test']);

// Full build for publishing
gulp.task('build', ['build:index', 'build:intros', 'build:demos', 'build:recipes', 'build:docs', 'build:css', 'build:js']);
