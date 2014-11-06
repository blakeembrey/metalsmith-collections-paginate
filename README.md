# Metalsmith Collections Paginate

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

A [Metalsmith](http://metalsmith.io/) plugin for paginating [collections](https://github.com/segmentio/metalsmith-collections).

## Installation

```sh
npm install metalsmith-collections-paginate --save
```

## Usage

To paginate a collection of files, you need to add a property with the same collection name to the options object that you use to initialize the plugin.

### CLI

Install via npm and then add `metalsmith-collections-paginate` to your `metalsmith.json`:

```json
{
  "plugins": {
    "metalsmith-collections-paginate": {
      "articles": {
        "perPage": 5,
        "template": "index.jade",
        "first": "index.html",
        "path": "page/:num/index.html"
      }
    }
  }
}
```

### JavaScript

Install via npm, require the module and `.use` the result of the function.

```js
var paginate = require('metalsmith-collections-paginate');

metalsmith.use(paginate({
  articles: {
    perPage: 5,
    template: 'index.jade',
    first: 'index.html',
    path: 'page/:num/index.html',
    pageMetadata: {
      title: 'Articles Archive'
    }
  }
}));
```

The `pageMetadata` option is optional. The object passed as `pageMetadata`
is used as the base for any created pages metadata. This allows for adding
arbitrary metadata to the created pages like a page title variable, allowing
for more reuse of list page templates.


### Template

Within the template file you specified, you will have access to a bunch of pagination specific variables:

* `paginate.num` - The current page number.
* `paginate.files` - All the files on the current page, iterate over this to render the page.
* `paginate.name` - The name of the current collection.
* `paginate.pages` - A link to all the pages in the collection (aliased under `collection.pages`).
* `paginate.next` - Links to the next page file, if it exists.
* `paginate.previous` - Links to the previous page file, if it exists.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/metalsmith-collections-paginate.svg?style=flat
[npm-url]: https://npmjs.org/package/metalsmith-collections-paginate
[travis-image]: https://img.shields.io/travis/blakeembrey/metalsmith-collections-paginate.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/metalsmith-collections-paginate
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/metalsmith-collections-paginate.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/metalsmith-collections-paginate?branch=master
[gittip-image]: https://img.shields.io/gittip/blakeembrey.svg?style=flat
[gittip-url]: https://www.gittip.com/blakeembrey
