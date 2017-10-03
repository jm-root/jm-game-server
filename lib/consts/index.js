'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BaseErrCode = 3000;

exports.default = {
  Err: {
    FA_INVALID_SESSION: {
      err: BaseErrCode++,
      msg: 'invalid session'
    },
    FA_INVALID_TOKEN: {
      err: BaseErrCode++,
      msg: 'invalid token'
    }
  }
};
module.exports = exports['default'];