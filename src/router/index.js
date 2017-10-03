import error from 'jm-err'
import MS from 'jm-ms-core'

let ms = new MS()
let Err = error.Err
export default function (opts = {}) {
  let service = this
  let t = function (doc, lng) {
    if (doc && lng && doc.err && doc.msg) {
      return {
        err: doc.err,
        msg: service.t(doc.msg, lng) || Err.t(doc.msg, lng) || doc.msg
      }
    }
    return doc
  }

  let router = ms.router()
  router
    .add('/connect', 'get', function (opts, cb) {
      service.connect(opts.data, opts.session)
        .then(function (doc) {
          cb(null, {ret: doc.id})
        })
        .catch(function (err) {
          cb(err, t({
            err: err.code,
            msg: err.message
          }, opts.lng))
        })
    })
  return router
}
