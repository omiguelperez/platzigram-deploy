'use strict'

const { send, json } = require('micro')
const HttpHash = require('http-hash')
const Db = require('platzigram-db')
const config = require('./config')
const DbStub = require('./test/stub/db')
const utils = require('./lib/utils')

let db = new Db(config.db)

if (process.env.NODE_ENV === 'test') {
  db = new DbStub()
}

let hash = HttpHash()

hash.set('POST /', async function authenticate (req, res, params) {
  let { username, password } = await json(req)
  await db.connect()
  let auth = await db.authenticate(username, password)
  await db.disconnect()
  
  if (!auth) {
    return send(res, 401, { error: 'invalid credentials' })
  }

  let token = await utils.signToken({
    userId: username
  }, config.secret)

  send(res, 200, token)
})

module.exports = async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
