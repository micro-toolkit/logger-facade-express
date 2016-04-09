var http = require('http');

function createServer(loggerMiddleware) {
  var middle = noopMiddleware;

  return http.createServer(function onRequest(req, res) {

    loggerMiddleware(req, res, function onNext(err) {
      // allow req, res alterations
      middle(req, res, function onDone() {
        if (err) {
          res.statusCode = 500;
          return res.end(err.message);
        }

        res.setHeader('X-Sent', 'true');
        res.end((req.connection && req.connection.remoteAddress) || '-');
      });
    });
  });
}

function noopMiddleware(req, res, next) {
  next();
}

module.exports = {
  createServer: createServer
};
