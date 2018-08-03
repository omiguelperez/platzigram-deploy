'use strict'

const test = require('ava')
const nock = require('nock')
const platzigram = require('../')
const fixtures = require('./fixtures')

let options = {
  endpoints: {
    pictures: 'http://platzigram.test/picture',
    users: 'http://platzigram.test/user',
    auth: 'http://platzigram.test/auth'
  }
}

test.beforeEach(t => {
  t.context.client = platzigram.createClient(options)
})

test('client', t => {
  let client = t.context.client

  t.is(typeof client.getPicture, 'function', 'getPicture should be a function')
  t.is(typeof client.savePicture, 'function', 'savePicture should be a function')
  t.is(typeof client.likePicture, 'function', 'likePicture should be a function')
  t.is(typeof client.listPictures, 'function', 'listPictures should be a function')
  t.is(typeof client.listPicturesByTag, 'function', 'listPicturesByTag should be a function')
  t.is(typeof client.saveUser, 'function', 'saveUser should be a function')
  t.is(typeof client.getUser, 'function', 'getUser should be a function')
  t.is(typeof client.auth, 'function', 'auth should be a function')
})

test('get picture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()

  nock(options.endpoints.pictures)
    .get(`/${image.publicId}`)
    .reply(200, image)

  let result = await client.getPicture(image.publicId)

  t.deepEqual(result, image)
})

test('save picture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()
  let token = 'xxx-xxx-xxx'
  let newImage = {
    src: image.url,
    description: image.description
  }

  nock(options.endpoints.pictures, {
    reqheaders: {
      Authorization: `Bearer ${token}`
    }
  })
    .post('/', newImage)
    .reply(201, image)

  let result = await client.savePicture(newImage, token)

  t.deepEqual(result, image)
})

test('like picture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()
  image.liked = true
  image.likes = 1

  nock(options.endpoints.pictures)
    .post(`/${image.publicId}/like`)
    .reply(200, image)

  let result = await client.likePicture(image.publicId)

  t.deepEqual(result, image)
})

test('list pictures', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)

  nock(options.endpoints.pictures)
    .get(`/list`)
    .reply(200, images)

  let result = await client.listPictures()

  t.deepEqual(result, images)
})

test('list pictures by tag', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)
  let tag = 'platzi'

  nock(options.endpoints.pictures)
    .get(`/tag/${tag}`)
    .reply(200, images)

  let result = await client.listPicturesByTag(tag)

  t.deepEqual(result, images)
})

test('save user', async t => {
  const client = t.context.client

  let user = fixtures.getUser()
  let newUser = {
    name: user.name,
    username: user.username,
    email: 'user@platzigram.test',
    password: 'pl4tzi.'
  }

  nock(options.endpoints.users)
    .post('/', newUser)
    .reply(201, user)

  let result = await client.saveUser(newUser)

  t.deepEqual(result, user)
})

test('get user', async t => {
  const client = t.context.client

  let user = fixtures.getUser()

  nock(options.endpoints.users)
    .get(`/${user.username}`)
    .reply(200, user)

  let result = await client.getUser(user.username)

  t.deepEqual(result, user)
})

test('auth', async t => {
  const client = t.context.client

  let crendentials = {
    username: 'mr.robot',
    password: 'hacky-elliot'
  }
  let token = 'xxx-xxx-xxx'

  nock(options.endpoints.auth)
    .post('/', crendentials)
    .reply(200, token)

  let result = await client.auth(crendentials.username, crendentials.password)

  t.deepEqual(result, token)
})
