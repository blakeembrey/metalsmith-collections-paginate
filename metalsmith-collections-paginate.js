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
      var pageOpts = extend({}, DEFAULTS, opts[name]);
      var collection;

      if (pageOpts.collection === false) {
        collection = metadata[name];
      } else {
        collection = metadata.collections && metadata.collections[name];
      }

      // Throw an error if the collection does not exist.
      if (!collection) {
        return done(new Error('Collection "' + name + '" does not exist'));
      }

      var perPage  = pageOpts.perPage;
      var pages    = collection.pages = [];
      var numPages = Math.ceil(collection.length / perPage);

      if (!pageOpts.template) {
        return done(new Error('Specify a template for "' + name + '" pages'));
      }

      // Iterate over every page and generate a pages array.
      for (var i = 0; i < numPages; i++) {
        var pageFiles = collection.slice(i * perPage, (i + 1) * perPage);

        // Create the pagination object for the current page.
        var paginate = {
          num:   i + 1,
          pages: pages,
          name:  name,
          files: extend(pageFiles, { metadata: collection.metadata })
        };

        // Generate a new file based on the filename with correct metadata.
        var page = extend({}, pageOpts.pageMetadata, {
          template: pageOpts.template,
          contents: new Buffer(''),
          path:     interpolate(pageOpts.path, paginate),
          paginate: paginate
        });

        // Create the file.
        files[page.path] = page;

        // Update next/prev references.
        if (i > 0) {
          page.paginate.previous = pages[i - 1];
          pages[i - 1].paginate.next = page;
        }

        // When the first page option is set, render it over the top of the
        // canonically generated page.
        if (i === 0 && pageOpts.first) {
          page = extend({}, page, {
            path: interpolate(pageOpts.first, page.paginate)
          });

          files[page.path] = page;
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
