var expect   = require('chai').expect;
var paginate = require('./');

/**
 * Create a psuedo metalsmith instance from a metadata object.
 *
 * @param  {Object} metadata
 * @return {Object}
 */
function instance (metadata) {
  return {
    metadata: function () {
      return metadata;
    }
  };
}

describe('metalsmith collections paginate', function () {
  describe('multiple pages', function () {
    var files = {};

    var metadata = {
      collections: {
        articles: [
          { contents: '' },
          { contents: '' },
          { contents: '' },
          { contents: '' },
          { contents: '' },
          { contents: '' },
          { contents: '' }
        ]
      },
      authors: [
        { name: '' },
        { name: '' },
        { name: '' },
        { name: '' },
        { name: '' },
        { name: '' },
        { name: '' }
      ]
    };

    var metalsmith = instance(metadata);

    it('should split a collection into individual files', function (done) {
      return paginate({
        articles: {
          perPage: 3,
          template: 'index.jade'
        }
      })(files, metalsmith, function (err) {
        var firstPage = files['articles/index.html'];
        var pageOne   = files['articles/page/1/index.html'];
        var pageTwo   = files['articles/page/2/index.html'];
        var pageThree = files['articles/page/3/index.html'];

        expect(firstPage).to.exist;
        expect(firstPage).to.not.equal(pageOne);
        expect(firstPage.paginate.next).to.equal(pageTwo);
        expect(firstPage.paginate.previous).to.not.exist;

        expect(pageOne).to.exist;
        expect(pageOne.paginate.next).to.equal(pageTwo);
        expect(pageOne.paginate.previous).to.not.exist;

        expect(pageTwo).to.exist;
        expect(pageTwo.paginate.next).to.equal(pageThree);
        expect(pageTwo.paginate.previous).to.equal(firstPage);

        expect(pageThree).to.exist;
        expect(pageThree.paginate.next).to.not.exist;
        expect(pageThree.paginate.previous).to.equal(pageTwo);

        expect(metadata.collections.articles.pages).to.have.length(3);

        expect(firstPage.template).to.equal('index.jade');
        expect(firstPage.paginate.num).to.equal(1);
        expect(firstPage.paginate.name).to.equal('articles');
        expect(firstPage.paginate.pages).to.equal(
          metadata.collections.articles.pages
        );

        return done(err);
      });
    });

    it('should split a metadata array into individual files', function (done) {
      return paginate({
        authors: {
          perPage: 3,
          template: 'index.jade',
          collection: false
        }
      })(files, metalsmith, function (err) {
        var firstPage = files['authors/index.html'];
        var pageOne   = files['authors/page/1/index.html'];
        var pageTwo   = files['authors/page/2/index.html'];
        var pageThree = files['authors/page/3/index.html'];

        expect(firstPage).to.exist;
        expect(firstPage).to.not.equal(pageOne);
        expect(firstPage.paginate.next).to.equal(pageTwo);
        expect(firstPage.paginate.previous).to.not.exist;

        expect(pageOne).to.exist;
        expect(pageOne.paginate.next).to.equal(pageTwo);
        expect(pageOne.paginate.previous).to.not.exist;

        expect(pageTwo).to.exist;
        expect(pageTwo.paginate.next).to.equal(pageThree);
        expect(pageTwo.paginate.previous).to.equal(firstPage);

        expect(pageThree).to.exist;
        expect(pageThree.paginate.next).to.not.exist;
        expect(pageThree.paginate.previous).to.equal(pageTwo);

        expect(metadata.authors.pages).to.have.length(3);

        expect(firstPage.template).to.equal('index.jade');
        expect(firstPage.paginate.num).to.equal(1);
        expect(firstPage.paginate.name).to.equal('authors');
        expect(firstPage.paginate.pages).to.equal(
          metadata.authors.pages
        );

        return done(err);
      });
    });

    it('should add metadata to pages created', function (done) {
      return paginate({
        articles: {
          perPage: 3,
          template: 'index.jade',
          pageMetadata: {
            foo: 'bar',
            some: {
              thing: true
            }
          }
        }
      })(files, metalsmith, function (err) {
        var firstPage = files['articles/index.html'];
        var pageOne   = files['articles/page/1/index.html'];
        var pageTwo   = files['articles/page/2/index.html'];
        var pageThree = files['articles/page/3/index.html'];

        expect(firstPage).to.exist;
        expect(firstPage.foo).to.equal('bar');
        expect(firstPage.some.thing).to.equal(true);

        expect(pageOne).to.exist;
        expect(pageOne.foo).to.equal('bar');
        expect(pageOne.some.thing).to.equal(true);

        expect(pageTwo).to.exist;
        expect(pageTwo.foo).to.equal('bar');
        expect(pageTwo.some.thing).to.equal(true);

        expect(pageThree).to.exist;
        expect(pageThree.foo).to.equal('bar');
        expect(pageThree.some.thing).to.equal(true);

        return done(err);
      });
    });
  });

  describe('missing collection', function () {
    var files      = {};
    var metalsmith = instance({});

    it('should error when the collection does not exist', function (done) {
      return paginate({
        articles: {
          template: 'index.jade'
        }
      })(files, metalsmith, function (err) {
        expect(err).to.exist;

        return done();
      });
    });
  });

  describe('options error', function () {
    var files = {};

    var metalsmith = instance({
      collections: {
        articles: []
      }
    });

    it('should error when a template is not specified', function (done) {
      return paginate({
        articles: {}
      })(files, metalsmith, function (err) {
        expect(err).to.exist;

        return done();
      });
    });
  });
});
