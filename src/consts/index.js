let BaseErrCode = 3000

export default {
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
}
