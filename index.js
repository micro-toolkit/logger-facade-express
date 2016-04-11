var middleware = require('./middleware');

/* jshint ignore:start */
function compile(format) {
  if (typeof format !== 'string') {
    throw new TypeError('argument format must be a string');
  }

  var fmt = format.replace(/"/g, '\\"');
  var replacer = function (_, name, arg) {
    return '"\n    + (tokens["' + name + '"](req, res, ' +
      String(JSON.stringify(arg)) + ') || "-") + "';
  };
  var regexp = /:([-\w]{2,})(?:\[([^\]]+)\])?/g;
  var js = '  return "' + fmt.replace(regexp, replacer) + '";';
  return new Function('tokens, req, res', js);
}
/* jshint ignore:end */

var defaultFormat = ':id :remote-addr :method :url HTTP/:http-version :status' +
  ' :res[content-length] ":referrer" ":user-agent" - :response-time ms';

/**
 * Create a logger middleware.
 *
 * @public
 * @param {String|Function} format
 * @return {Function} middleware
 */
function logger(format) {
  var fmt = format || defaultFormat;
  // format function
  var formatLine = typeof fmt !== 'function' ? compile(fmt) : fmt;
  return middleware(formatLine);
}

module.exports = logger;
