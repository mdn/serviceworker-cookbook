var marked = require('marked');
var glob = require('glob');
var fs = require('fs');
var assert = require('assert');

var difficulties = {
  'Advanced': 3,
  'Intermediate': 2,
  'Beginner': 1
};

var categories = module.exports.categories = [
  { title: 'Caching strategies', slug: 'caching-strategies' },
  { title: 'Web Push', slug: 'web-push' },
  { title: 'General Usage', slug: 'general-usage' },
  { title: 'Offline', slug: 'offline' },
  { title: 'Beyond Offline', slug: 'beyond-offline' },
  { title: 'Performance', slug: 'performance' }
];

var categoryOrder = categories.map(function(category) {
  return category.title;
});

module.exports.parse = function(recipeSlugs) {
  var recipes = recipeSlugs.map(function(recipe) {
    var tokens = marked.lexer(fs.readFileSync(recipe + '/README.md', 'utf8'));
    assert(tokens.length > 1, recipe + ': README.md must have contents.');
    assert(tokens[0].type === 'heading', recipe + ': README.md first token must be header.');
    assert(tokens[1].type === 'paragraph', recipe + ': README.md second token must be summary.');
    var name = tokens[0].text;
    var summary = tokens[1].text;

    function getMetadata(type) {
      var index;
      for (index = 0; index < tokens.length; index++) {
        var token = tokens[index];
        if (token.type === 'heading' && token.text === type) {
          break;
        }
      }
      assert(index !== -1, recipe + ': README.md should contain a ' + type);
      assert(index + 1 <= tokens.length, recipe + ': README.md should contain a ' + type);

      return tokens[index + 1].text;
    }

    var difficultyTerm = getMetadata('Difficulty'), difficulty = 0;
    if(difficultyTerm in difficulties) {
      difficulty = difficulties[difficultyTerm];
    } else {
      assert(false, recipe + ': Unexpected difficulty value "' + difficultyTerm + '"');
    }

    var srcs = glob.sync('*.js', { cwd: recipe }).map(function(src) {
      var srcName = src.substr(0, src.length - 3);
      return {
        filename: src,
        name: srcName,
        ref: recipe + '_' + srcName + '_doc.html'
      };
    });

    var category = getMetadata('Category');
    assert(categoryOrder.indexOf(category) !== -1, name + ': Unexpected category value "' + category + '"');

    return {
      name: name,
      summary: summary,
      difficulty: difficulty,
      difficultyTerm: difficultyTerm,
      category: category,
      slug: recipe,
      srcs: srcs,
      demo_ref: recipe + '_demo.html',
      demo_index: recipe + '/index.html',
      intro_ref: recipe + '.html',
    };
  });

  // Sort categories by category preference, then by difficulty
  recipes = recipes.sort(function(recipeA, recipeB) {
    // Sort by category
    if (categoryOrder.indexOf(recipeA.category) === categoryOrder.indexOf(recipeB.category)) {
      // Sort by difficulty
      if (recipeA.category === recipeB.category) {
        return recipeA.difficulty < recipeB.difficulty ? -1 : 1;
      }
      if (recipeA.category < recipeB.category) {
        return -1;
      }
      return 1;
    } else if (categoryOrder.indexOf(recipeA.category) > categoryOrder.indexOf(recipeB.category)) {
      return 1;
    } else {
      return -1;
    }
  });

  return recipes;
};
