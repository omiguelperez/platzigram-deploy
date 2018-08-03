'use strict'

const port = process.env.PORT || 5151

const http = require('http')
const r = require('rethinkdb')
const socketio = require('socket.io')
const config = require('./config')

const server = http.createServer()
const io = socketio(server)

r.connect(config.db, (err, conn) => {
  if (err) return console.error(err.message)

  r.table('images').changes().run(conn, (err, cursor) => {
    if (err) return console.error(err.message)

    cursor.on('data', data => {
      let image = data.new_val

      if (image.publicId != null) {
        io.sockets.emit('image', image)
      }
    })
  })
})

server.listen(port, () => console.log(`listening on port ${port}`))
