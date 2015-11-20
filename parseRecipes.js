var marked = require('marked');
var glob = require('glob');
var fs = require('fs');
var assert = require('assert');

module.exports = function(recipeSlugs) {
  return recipeSlugs.map(function(recipe) {
    var tokens = marked.lexer(fs.readFileSync(recipe + '/README.md', 'utf8'));
    assert(tokens.length > 1, recipe + ': README.md must have contents.');
    assert(tokens[0].type === 'heading', recipe + ': README.md first token must be header.');
    assert(tokens[1].type === 'paragraph', recipe + ': README.md second token must be summary.');
    var name = tokens[0].text;
    var summary = tokens[1].text;

    function getMetadata(type) {
      var i;
      for (i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (token.type === 'heading' && token.text === type) {
          break;
        }
      }
      assert(i !== -1, recipe + ': README.md should contain a ' + type);
      assert(i + 1 <= tokens.length, recipe + ': README.md should contain a ' + type);

      return tokens[i + 1].text;
    }

    var difficulty = getMetadata('Difficulty');
    if (difficulty === 'Advanced') {
      difficulty = 3;
    } else if (difficulty === 'Intermediate') {
      difficulty = 2;
    } else if (difficulty === 'Beginner') {
      difficulty = 1;
    } else {
      assert(false, recipe + ': Unexpected difficulty value');
    }

    var srcs = glob.sync('*.js', { cwd: recipe }).map(function(src) {
      var srcName = src.substr(0, src.length - 3);
      return {
        filename: src,
        name: srcName,
        ref: recipe + '_' + srcName + '_doc.html'
      };
    });

    return {
      name: name,
      summary: summary,
      difficulty: difficulty,
      category: getMetadata('Category'),
      slug: recipe,
      srcs: srcs,
      demo_ref: recipe + '_demo.html',
      demo_index: recipe + '/index.html',
      intro_ref: recipe + '.html',
    };
  });
};
