import event from 'jm-event'
import error from 'jm-err'
import Promise from 'bluebird'
import MS from 'jm-ms'
import log from 'jm-log4js'
import consts from '../consts'
import t from '../locale'

let Err = consts.Err
let ms = MS()
let logger = log.getLogger('jm-game-server')

/**
 * game-server service
 * @param {Object} opts
 * @example
 * opts参数:{
 *  gateway: gateway
 * }
 * @return {Object} service
 */
export default function (opts = {}) {
  let o = {
    ready: true,
    t: t,

    onReady: function () {
      let self = this
      return new Promise(function (resolve, reject) {
        if (self.ready) return resolve(self.ready)
        self.on('ready', function () {
          resolve()
        })
      })
    },

    connect: function (msg, session) {
      let self = this
      if (!session) {
        return Promise.reject(error.err(Err.FA_INVALID_SESSION))
      }
      let token = msg.token
      if (!token) {
        return Promise.reject(error.err(Err.FA_INVALID_TOKEN))
      }
      return self.sso
        .get('/user', {token})
        .then(function (doc) {
          session && (session.user = doc)
          return doc
        })
    }
  }
  event.enableEvent(o)

  let bind = function (name, uri) {
    uri === undefined && (uri = opts.gateway + '/' + name)
    ms.client({
      uri: uri
    }, function (err, doc) {
      !err && doc && (o[name] = doc)
    })
  }
  bind('sso')
  bind('passport')

  o.on('connection', function (session) {
    console.log('%j connected', session)
    session.on('close', function () {
      console.log('%j closed', session)
    })
  })

  return o
}
