import chai from 'chai'
import MS from 'jm-ms'
import log4js from 'jm-log4js'

let logger = log4js.logger
let expect = chai.expect
let ms = MS()

let log = (err, doc) => {
  err && console.error(err.stack)
}

let username = 'root'
let password = '123'

let service = {}
var bind = function (name, uri) {
  uri === undefined && (uri = 'http://api.h5.jamma.cn:81' + '/' + name)
  ms.client({
    uri: uri
  }, function (err, doc) {
    !err && doc && (service[name] = doc)
  })
}
bind('sso')
bind('passport')

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

let connect = function () {
  return new Promise(function (resolve, reject) {
    if (service.client) resolve(service.client)
    ms.client({
      uri: 'ws://localhost:3000'
    }, function (err, doc) {
      if (!err && doc) {
        let client = doc
        client.on('message', function (data) {
          var json = null
          try {
            json = JSON.parse(data)
          } catch (err) {
            logger.error(err.stack)
            return
          }

          if (json.type === 'message') {
            client.emit(json.data.channel, json.data.msg)
          }
        })

        client.on('notice', function (msg) {
          logger.debug('notice: %s', msg)
        })

        client.on('open', function () {
          service.client = client

          client.post('/messages/subscribe', {channel: 'notice'}, log)
          client.post('/messages/publish', {channel: 'notice', msg: 'a client msg'}, log)
          client.post('/messages/broadcast', {channel: 'notice', msg: 'a client broadcast'}, log)
          client.post('/messages/unsubscribe', {channel: 'notice'}, log)
          client.post('/messages/broadcast', {channel: 'notice', msg: 'a broadcast'}, log)
          client.post('/messages/subscribe', {channel: 'notice'}, log)

          resolve(client)
        })
      } else {
        reject(err)
      }
    })
  })
}

describe('client', function () {
  it('connect', function (done) {
    init()
      .then(function () {
        return connect()
      })
      .then(function () {
        return service.client.get('/connector/connect', {token: service.currentUser.token})
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
