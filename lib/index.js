'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  ['gateway'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key]);
  });

  var self = this;

  var o = (0, _service2.default)(opts);
  o.router = _router2.default;

  if (self) {
    self.on('connection', function (session) {
      o.emit('connection', session);
    }).on('open', function () {
      o.messages = self.modules.messages;
      setInterval(function () {
        o.messages.publish({ data: { channel: 'notice', msg: 'a server msg' } });
      }, 100);
    });
  }

  return o;
};

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];