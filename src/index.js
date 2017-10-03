import service from './service'
import router from './router'

export default function (opts = {}) {
  ['gateway']
    .forEach(function (key) {
      process.env[key] && (opts[key] = process.env[key])
    })

  let self = this

  let o = service(opts)
  o.router = router

  if (self) {
    self
      .on('connection', function (session) {
        o.emit('connection', session)
      })
      .on('open', function () {
        o.messages = self.modules.messages
        setInterval(function () {
          o.messages.publish({data: {channel: 'notice', msg: 'a server msg'}})
        }, 100)
      })
  }

  return o
}
