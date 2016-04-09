var helpers = require('./helpers');
var Logger = require('logger-facade-nodejs');
var assert = require('assert');
var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var should = chai.should();
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

function noop(){ }

describe('logger()', function () {
  var spy, logger, log;

  before(function(){
    log = { debug: noop, info: noop };
    sinon.stub(Logger, 'getLogger').returns(log);
    logger = require('../index');
  });

  after(function () {
    Logger.getLogger.restore();
  });

  it('should log as default format string', function (done) {
    var spy = sinon.spy(log, 'info');
    var logEntry = /- ::ffff:127\.0\.0\.1 GET \/ HTTP\/1\.1 200 \d* "-" "node-superagent\/1\.8\.3" - \d*\.\d* ms/;
    var cb = function (err, res) {
      if (err) { return done(err); }
      spy.should.have.been.calledWith(sinon.match.any, sinon.match(logEntry));
      spy.restore();
      done();
    };
    var mw = logger();
    request(helpers.createServer(mw))
      .get('/')
      .expect(200, cb);
  });

  it('should accept format as format string', function (done) {
    var spy = sinon.spy(log, 'info');
    var cb = function (err, res) {
      if (err) { return done(err); }
      spy.should.have.been.calledWith(sinon.match.any, 'GET /');
      spy.restore();
      done();
    };
    var mw = logger(':method :url');
    request(helpers.createServer(mw))
      .get('/')
      .expect(200, cb);
  });

  it('should accept format as function', function (done) {
    var spy = sinon.spy(log, 'info');
    var cb = function (err, res) {
      if (err) { return done(err); }
      spy.should.have.been.calledWith(sinon.match.any, 'GET / 200');
      spy.restore();
      done();
    };

    function format(tokens, req, res) {
      return [req.method, req.url, res.statusCode].join(' ');
    }

    var mw = logger(format);
    request(helpers.createServer(mw))
      .get('/')
      .expect(200, cb);
  });

  it('should log metadata', function (done) {
    var spy = sinon.spy(log, 'info');
    var cb = function (err, res, line) {
      if (err) { return done(err); }

      var expected = spy.firstCall.args[0];
      expected.should.have.property('id');
      expected.should.have.property('url');
      expected.should.have.property('method');
      expected.should.have.property('response-time');
      expected.should.have.property('response-length');
      expected.should.have.property('status');
      expected.should.have.property('referrer');
      expected.should.have.property('remote-addr');
      expected.should.have.property('http-version');
      expected.should.have.property('user-agent');
      spy.restore();
      done();
    };
    var mw = logger();
    request(helpers.createServer(mw))
      .get('/')
      .expect(200, cb);
  });
});
