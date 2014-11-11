var extend     = require('extend');
var pagination = require('metalsmith-pagination');

/**
 * Paginate based on the collection.
 *
 * @param  {Object}   opts
 * @return {Function}
 */
module.exports = function (opts) {
  var paginationOpts = {};

  Object.keys(opts).forEach(function (name) {
    var key            = 'collections["' + name.replace(/"/g, '\\"') + '"]';
    var collectionOpts = paginationOpts[key] = extend({}, opts[name]);

    // Maintain injecting an automatic first page.
    if (!collectionOpts.first) {
      collectionOpts.first = name + '/index.html';
    }

    if (!collectionOpts.path) {
      collectionOpts.path = name + '/page/:num/index.html';
    }
  });

  return pagination(paginationOpts);
};
