'use strict'

const { send, json } = require('micro')
const HttpHash = require('http-hash')
const gravatar = require('gravatar')
const config = require('./config')
const Db = require('platzigram-db')
const DbStub = require('./test/stub/db')

let db = new Db(config.db)

if (process.env.NODE_ENV === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('POST /', async function postUser (req, res, params) {
  let user = await json(req)
  await db.connect()
  let created = await db.saveUser(user)

  delete created.email
  delete created.password

  send(res, 201, created)
})

hash.set('GET /:username', async function getUser (req, res, params) {
  let { username } = params
  await db.connect()
  let user = await db.getUser(username)
  user.avatar = gravatar.url(user.email, { s: '200', r: 'pg', d: '404' })
  user.pictures = await db.getImagesByUser(username)

  delete user.email
  delete user.password

  send(res, 200, user)
})

module.exports = async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)

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
