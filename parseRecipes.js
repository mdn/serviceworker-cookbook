var marked = require('marked');
var glob = require('glob');
var fs = require('fs');
var assert = require('assert');
require('array.prototype.findindex');

module.exports = function(recipeSlugs) {
  return recipeSlugs.map(function(recipe) {
    var tokens = marked.lexer(fs.readFileSync(recipe + '/README.md', 'utf8'));
    assert(tokens.length > 1, recipe + ': README.md must have contents.');
    assert(tokens[0].type === 'heading', recipe + ': README.md first token must be header.');
    assert(tokens[1].type === 'paragraph', recipe + ': README.md second token must be summary.');
    var name = tokens[0].text;
    var summary = tokens[1].text;

    var difficultyIdx = tokens.findIndex(function(token) {
      return token.type === 'heading' && token.text === 'Difficulty';
    });
    assert(difficultyIdx !== -1, recipe + ': README.md should contain a difficulty');
    assert(difficultyIdx + 1 <= tokens.length, recipe + ': README.md should contain a difficulty');

    var difficulty;
    if (tokens[difficultyIdx + 1].text === 'Advanced') {
      difficulty = 3;
    } else if (tokens[difficultyIdx + 1].text === 'Intermediate') {
      difficulty = 2;
    } else if (tokens[difficultyIdx + 1].text === 'Beginner') {
      difficulty = 1;
    } else {
      assert(false, recipe + ': Unexpected difficulty value');
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
      summary: summary,
      difficulty: difficulty,
      slug: recipe,
      srcs: srcs,
      demo_ref: recipe + '_demo.html',
      intro_ref: recipe + '.html',
    };
  });
};
