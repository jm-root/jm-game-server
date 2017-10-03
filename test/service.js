import chai from 'chai'

let expect = chai.expect
import config from '../config'
import $ from '../src'

let service = $(config)
let router = service.router()

let log = (err, doc) => {
  err && console.error(err.stack)
}

let username = 'root'
let password = '123'

let init = function () {
  return new Promise(function (resolve, reject) {
    if (service.currentUser) resolve(service.currentUser)
    service.passport.post('/login',
      {
        username,
        password
      },
      function (err, doc) {
        if (!err && doc && !doc.err) {
          service.currentUser = doc
          return resolve(doc)
        }
        reject(err)
      })
  })
}

describe('service', function () {
  it('connect', function (done) {
    init()
      .then(function () {
        service
          .connect({
              token: service.currentUser.token
            },
            {}
          )
          .then(function (doc) {
            expect(doc !== null).to.be.ok
            done()
          })
          .catch(function (err) {
            log(err)
            expect(err !== null).to.be.ok
            done()
          })
      })
  })

  it('router', function (done) {
    return init()
      .then(function () {
        return router.get('/connect', {token: service.currentUser.token})
      })
      .then(function (doc) {
        expect(doc !== null).to.be.ok
        done()
      })
      .catch(function (err) {
        log(err)
        expect(err !== null).to.be.ok
        done()
      })
  })
})
