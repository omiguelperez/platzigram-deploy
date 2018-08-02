'use strict'

const test = require('ava')
const r = require('rethinkdb')
const uuid = require('uuid-base62')
const fixtures = require('./fixtures')
const Db = require('..')
const utils = require('../lib/utils')

test.beforeEach('setup database', async t => {
  const dbName = t.context.dbName = `platzigram_${uuid.v4()}`
  const dbPort = t.context.dbPort = process.env.PLATZIGRAM_DB_PORT || 28015
  const db = new Db({ db: dbName, port: dbPort, setup: true })

  await db.connect()
  t.context.db = db

  t.true(db.connected, 'should be connected')
})

test.afterEach.always('cleanup database', async t => {
  let { db, dbPort, dbName } = t.context

  await db.disconnect()
  t.false(db.connected, 'should be disconnected')

  let conn = await r.connect({ port: dbPort })
  await r.dbDrop(dbName).run(conn)
})

test('save image', async t => {
  let db = t.context.db

  t.is(typeof db.saveImage, 'function', 'saveImage should be a function')

  let image = fixtures.getImage()

  let created = await db.saveImage(image)
  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.is(created.userId, image.userId)
  t.deepEqual(created.tags, ['awesome', 'picture', 'tags'])
  t.is(typeof created.id, 'string')
  t.is(created.publicId, uuid.encode(created.id))
  t.truthy(created.createdAt)
})

test('like image', async t => {
  let db = t.context.db

  t.is(typeof db.likeImage, 'function', 'likeImage should be a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.publicId)

  t.is(result.likes, image.likes + 1)
  t.true(result.liked)
})

test('get image', async t => {
  let db = t.context.db

  t.is(typeof db.getImage, 'function', 'getImage should be a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.getImage(created.publicId)

  t.deepEqual(created, result)

  let err = await t.throws(db.getImage('foo'))
  t.regex(err.message, /not found/)
})

test('list all images', async t => {
  let db = t.context.db

  t.is(typeof db.getImages, 'function', 'getImages should be a function')

  let images = fixtures.getImages(3)
  let saveImages = images.map(image => db.saveImage(image))
  let created = await Promise.all(saveImages)
  let result = await db.getImages()

  t.is(created.length, result.length)
})

test('save user', async t => {
  let db = t.context.db

  t.is(typeof db.saveUser, 'function', 'saveUser should be a function')

  let user = fixtures.getUser()
  let plainPassword = user.password
  let created = await db.saveUser(user)

  t.is(created.name, user.name)
  t.is(created.email, user.email)
  t.is(created.username, user.username)
  t.is(created.password, utils.encrypt(plainPassword))
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt)
})

test('get user', async t => {
  let db = t.context.db

  t.is(typeof db.getUser, 'function', 'getUser should be a function')

  let user = fixtures.getUser()
  let created = await db.saveUser(user)
  let result = await db.getUser(user.username)

  t.deepEqual(created, result)

  let err = await t.throws(db.getUser('foo'))
  t.regex(err.message, /not found/)
})

test('authenticate user', async t => {
  let db = t.context.db

  t.is(typeof db.getUser, 'function', 'authenticate should be a function')

  let user = fixtures.getUser()
  let plainPassword = user.password
  await db.saveUser(user)

  let success = await db.authenticate(user.username, plainPassword)
  t.true(success)

  let fail = await db.authenticate(user.username, 'foo')
  t.false(fail)

  let failure = await db.authenticate('foo', 'bar')
  t.false(failure)
})

test('list images by user', async t => {
  let db = t.context.db

  t.is(typeof db.getImagesByUser, 'function', 'getImagesByUser should be a function')

  let images = fixtures.getImages(10)
  let userId = uuid.uuid()
  let random = Math.round(Math.random() * images.length)

  let saveImages = []
  for (let i = 0; i < images.length; i++) {
    if (i < random) {
      images[i].userId = userId
    }
    saveImages.push(db.saveImage(images[i]))
  }
  await Promise.all(saveImages)

  let result = await db.getImagesByUser(userId)
  t.is(result.length, random)
})

test('list images by tag', async t => {
  let db = t.context.db

  t.is(typeof db.getImagesByTag, 'function', 'getImagesByTag should be a function')

  let images = fixtures.getImages(10)
  let tag = '#filterit'
  let random = Math.round(Math.random() * images.length)

  let saveImages = []
  for (let i = 0; i < images.length; i++) {
    if (i < random) {
      images[i].description = tag
    }
    saveImages.push(db.saveImage(images[i]))
  }
  await Promise.all(saveImages)

  let result = await db.getImagesByTag(tag)
  t.is(result.length, random)
})
