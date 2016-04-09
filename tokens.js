function getUrl(req) {
  return req.originalUrl || req.url;
}

function getMethod(req) {
  return req.method;
}

function getResponseTime(req, res, digits) {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return;
  }

  // calculate diff
  var ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;

  // return truncated value
  return ms.toFixed(digits === undefined ? 3 : digits);
}

function getStatus(req, res) {
  return res._header ? String(res.statusCode) : undefined;
}

function getReferrer(req) {
  return req.headers.referer || req.headers.referrer;
}

function getIp(req) {
  return req.ip || req._remoteAddress ||
    (req.connection && req.connection.remoteAddress) || null;
}

function getHttpVersion(req) {
  return req.httpVersionMajor + '.' + req.httpVersionMinor;
}

function getUserAgent(req) {
  return req.headers['user-agent'];
}

function getRequest(req, res, field) {
  // get header
  var header = req.headers[field.toLowerCase()];

  return Array.isArray(header) ? header.join(', ') : header;
}

function getId(req) {
  return req.id || req.requestId || null;
}

module.exports = {
  getUrl: getUrl,
  getMethod: getMethod,
  getResponseTime: getResponseTime,
  getStatus: getStatus,
  getReferrer: getReferrer,
  getIp: getIp,
  getHttpVersion: getHttpVersion,
  getUserAgent: getUserAgent,
  getRequest: getRequest,
  getId: getId
};
