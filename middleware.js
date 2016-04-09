var Logger = require('logger-facade-nodejs');
var log = Logger.getLogger('Express');
var onFinished = require('on-finished');
var onHeaders = require('on-headers');
var tokens = require('./tokens');

function recordStartTime() {
  this._startAt = process.hrtime();
  this._startTime = new Date();
}

function getMetadata(req, res){
  var status = parseInt(tokens.getStatus(req, res), 10);
  var time = parseFloat(tokens.getResponseTime(req, res), 10);
  return {
    id: tokens.getId(req, res),
    url: tokens.getUrl(req, res),
    method: tokens.getMethod(req, res),
    'response-time': time,
    'response-length': res['content-length'],
    status: status,
    referrer: tokens.getReferrer(req, res),
    'remote-addr': tokens.getIp(req, res),
    'http-version': tokens.getHttpVersion(req, res),
    'user-agent': tokens.getUserAgent(req, res)
  };
}

function middleware(formatLine) {
  var logger = function (req, res, next) {
    // request data
    req._startAt = undefined;
    req._startTime = undefined;
    req._remoteAddress = tokens.getIp(req);

    // response data
    res._startAt = undefined;
    res._startTime = undefined;

    // record request start
    recordStartTime.call(req);

    log.debug('Start Request %s', tokens.getId(req) || '-');

    function logRequest() {
      var line = formatLine(logger, req, res);
      var metadata = getMetadata(req, res);
      log.info(metadata, line);
      log.debug('End request %s', tokens.getId(req) || '-');
    }

    // record response start
    onHeaders(res, recordStartTime);

    // log when response finished
    onFinished(res, logRequest);

    next();
  };

  logger.token = function(name, fn) {
    logger[name] = fn;
    return logger;
  };

  logger.token('id', tokens.getId);
  logger.token('url', tokens.getUrl);
  logger.token('method', tokens.getMethod);
  logger.token('response-time', tokens.getResponseTime);
  logger.token('status', tokens.getStatus);
  logger.token('referrer', tokens.getReferrer);
  logger.token('remote-addr', tokens.getIp);
  logger.token('http-version', tokens.getHttpVersion);
  logger.token('user-agent', tokens.getUserAgent);
  logger.token('req', tokens.getRequest);
  logger.token('res', tokens.getResponseTime);

  return logger;
}

module.exports = middleware;
