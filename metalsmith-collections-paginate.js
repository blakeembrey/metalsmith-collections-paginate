var extend = require('extend');

/**
 * Page collection defaults.
 *
 * @type {Object}
 */
var DEFAULTS = {
  perPage: 10,
  first: ':name/index.html',
  path: ':name/page/:num/index.html'
};

/**
 * Paginate based on the collection.
 *
 * @param  {Object}   opts
 * @return {Function}
 */
module.exports = function (opts) {
  var keys = Object.keys(opts);

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata();

    // Iterate over all the paginate names and match with collections.
    var complete = keys.every(function (name) {
      var collection = metadata.collections && metadata.collections[name];

      // Throw an error if the collection does not exist.
      if (!collection) {
        return done(new Error('Collection "' + name + '" does not exist'));
      }

      var pageOpts = extend({}, DEFAULTS, opts[name]);
      var perPage  = pageOpts.perPage;
      var pages    = collection.pages = [];
      var numPages = Math.ceil(collection.length / perPage);

      if (!pageOpts.template) {
        return done(new Error('Specify a template for "' + name + '" pages'));
      }

      // Iterate over every page and generate a pages array.
      for (var i = 0; i < numPages; i++) {
        var pageFiles = collection.slice(i * perPage, (i + 1) * perPage);

        // Generate a new file based on the filename with correct metadata.
        var page = {
          template: pageOpts.template,
          contents: new Buffer(''),
          paginate: {
            num:   i + 1,
            pages: pages,
            name:  name,
            files: extend(pageFiles, { metadata: collection.metadata })
          }
        };

        // Render the first page differently to the rest, when set.
        if (i === 0 && pageOpts.first) {
          files[interpolate(pageOpts.first, page.paginate)] = page;
        } else {
          files[interpolate(pageOpts.path, page.paginate)] = page;
        }

        // Update next/prev references.
        if (pages[i - 1]) {
          page.paginate.previous = pages[i - 1];
          pages[i - 1].paginate.next = page;
        }

        pages.push(page);
      }

      return true;
    });

    return complete && done();
  };
};

/**
 * Interpolate the page path with pagination variables.
 *
 * @param  {String} path
 * @param  {Object} opts
 * @return {String}
 */
function interpolate (path, opts) {
  return path.replace(/:num/g, opts.num).replace(/:name/g, opts.name);
}
