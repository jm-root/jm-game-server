'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var o = {
    ready: true,
    t: _locale2.default,

    onReady: function onReady() {
      var self = this;
      return new _bluebird2.default(function (resolve, reject) {
        if (self.ready) return resolve(self.ready);
        self.on('ready', function () {
          resolve();
        });
      });
    },

    connect: function connect(msg, session) {
      var self = this;
      if (!session) {
        return _bluebird2.default.reject(_jmErr2.default.err(Err.FA_INVALID_SESSION));
      }
      var token = msg.token;
      if (!token) {
        return _bluebird2.default.reject(_jmErr2.default.err(Err.FA_INVALID_TOKEN));
      }
      return self.sso.get('/user', { token: token }).then(function (doc) {
        session && (session.user = doc);
        return doc;
      });
    }
  };
  _jmEvent2.default.enableEvent(o);

  var bind = function bind(name, uri) {
    uri === undefined && (uri = opts.gateway + '/' + name);
    ms.client({
      uri: uri
    }, function (err, doc) {
      !err && doc && (o[name] = doc);
    });
  };
  bind('sso');
  bind('passport');

  o.on('connection', function (session) {
    console.log('%j connected', session);
    session.on('close', function () {
      console.log('%j closed', session);
    });
  });

  return o;
};

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _jmMs = require('jm-ms');

var _jmMs2 = _interopRequireDefault(_jmMs);

var _jmLog4js = require('jm-log4js');

var _jmLog4js2 = _interopRequireDefault(_jmLog4js);

var _consts = require('../consts');

var _consts2 = _interopRequireDefault(_consts);

var _locale = require('../locale');

var _locale2 = _interopRequireDefault(_locale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Err = _consts2.default.Err;
var ms = (0, _jmMs2.default)();
var logger = _jmLog4js2.default.getLogger('jm-game-server');

/**
 * game-server service
 * @param {Object} opts
 * @example
 * opts参数:{
 *  gateway: gateway
 * }
 * @return {Object} service
 */
module.exports = exports['default'];