var expect   = require('chai').expect;
var paginate = require('./');

describe('metalsmith collections paginate', function () {
  describe('split a collection into multiple pages', function () {
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
      }
    };

    var metalsmith = {
      metadata: function () {
        return metadata;
      }
    };

    it('should split a collection into individual files', function (done) {
      return paginate({
        articles: {
          perPage: 3,
          template: 'index.jade'
        }
      })(files, metalsmith, function (err) {
        expect(files['articles/index.html']).to.exist;
        expect(files['articles/index.html'].paginate.next.path).to.equal(
          'articles/page/2/index.html'
        );
        expect(files['articles/page/2/index.html']).to.exist;
        expect(files['articles/page/2/index.html'].paginate.previous.path).to
          .equal('articles/index.html');
        expect(files['articles/page/2/index.html'].paginate.next.path).to.equal(
          'articles/page/3/index.html'
        );
        expect(files['articles/page/3/index.html']).to.exist;
        expect(files['articles/page/3/index.html'].paginate.previous.path).to
          .equal('articles/page/2/index.html');

        expect(metadata.collections.articles.pages).to.have.length(3);

        expect(files['articles/index.html'].template).to.equal('index.jade');
        expect(files['articles/index.html'].paginate.num).to.equal(1);
        expect(files['articles/index.html'].paginate.name).to.equal('articles');
        expect(files['articles/index.html'].paginate.next).to.equal(
          files['articles/page/2/index.html']
        );
        expect(files['articles/index.html'].paginate.pages).to.equal(
          metadata.collections.articles.pages
        );

        return done(err);
      });
    });
  });

  describe('return error when missing collection', function () {
    var files = {};
    var metadata = {};

    var metalsmith = {
      metadata: function () {
        return metadata;
      }
    };

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

  describe('return error when missing collection', function () {
    var files = {};
    var metadata = {
      collections: {
        articles: []
      }
    };

    var metalsmith = {
      metadata: function () {
        return metadata;
      }
    };

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
