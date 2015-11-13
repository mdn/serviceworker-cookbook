var marked = require('marked');
var glob = require('glob');
var fs = require('fs');
var assert = require('assert');

module.exports = function(recipeSlugs) {
  return recipeSlugs.map(function(recipe) {
    var tokens = marked.lexer(fs.readFileSync(recipe + '/README.md', 'utf8'));
    if (!tokens.length) {
      console.warn(recipe + ': is missing title');
    }
    var name = tokens[0].text;
    if (!name.startsWith('Recipe: ')) {
      console.warn('Recipe should start with "Recipe: "');
    } else {
      name = name.substr(8);
    }
    var srcs = glob.sync('*.js', { cwd: recipe }).map(function(src) {
      assert(src.endsWith('.js'));
      var srcName = src.substr(0, src.length - 3);
      return {
        filename: src,
        name: srcName,
        ref: recipe + '_' + srcName + '_doc.html'
      };
    });
    return {
      name: name,
      slug: recipe,
      srcs: srcs,
      demo_ref: recipe + '_demo.html',
      intro_ref: recipe + '.html',
    };
  });
};
