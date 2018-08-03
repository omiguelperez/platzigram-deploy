'use strict'

const { send, json } = require('micro')
const HttpHash = require('http-hash')
const config = require('./config')
const utils = require('./lib/utils')
const Db = require('platzigram-db')
const DbStub = require('./test/stub/db')

let db = new Db(config.db)

if (process.env.NODE_ENV === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('GET /list', async function getPicturesList (req, res, params) {
  await db.connect()
  let images = await db.getImages()
  await db.disconnect()
  send(res, 200, images)
})

hash.set('GET /tag/:tag', async function getPicturesByTag (req, res, params) {
  let { tag } = params
  await db.connect()
  let images = await db.getImagesByTag(tag)
  await db.disconnect()
  send(res, 200, images)
})

hash.set('GET /:id', async function getPicture (req, res, params) {
  let { id } = params
  await db.connect()
  let image = await db.getImage(id)
  await db.disconnect()
  send(res, 200, image)
})

hash.set('POST /', async function savePicture (req, res, params) {
  let image = await json(req)

  try {
    let token = await utils.extractToken(req)
    let encoded = await utils.verifyToken(token, config.secret)
    if (encoded && encoded.userId !== image.userId) {
      throw new Error('invalid token')
    }
  } catch (e) {
    return send(res, 401, { error: 'invalid token' })
  }

  await db.connect()
  let created = await db.saveImage(image)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /:id/like', async function likePicture (req, res, params) {
  let { id } = params
  await db.connect()
  let liked = await db.likeImage(id)
  await db.disconnect()
  send(res, 200, liked)
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
