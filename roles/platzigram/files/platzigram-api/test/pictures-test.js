'use strict'

import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import fixtures from './fixtures'
import pictures from '../pictures'
import config from '../config'
import utils from '../lib/utils'

test.beforeEach(async t => {
  let srv = t.context.srv = micro(pictures)
  t.context.url = await listen(srv)
})

test.afterEach(t => {
  t.context.srv.close()
})

test('GET /:id', async t => {
  let image = fixtures.getImage()
  let { url } = t.context

  let body = await request({ uri: `${url}/${image.publicId}`, json: true })

  t.deepEqual(body, image)
})

test('no token POST /', async t => {
  let image = fixtures.getImage()
  let { url } = t.context

  let options = {
    method: 'POST',
    uri: url,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true,
    json: true
  }

  await t.throws(request(options), /invalid token/)
})

test('invalid token POST /', async t => {
  let image = fixtures.getImage()
  let { url } = t.context
  let token = await utils.signToken({ userId: 'hacker' }, config.secret)

  let options = {
    method: 'POST',
    uri: url,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  await t.throws(request(options), /invalid token/)
})

test('secure POST /', async t => {
  let image = fixtures.getImage()
  let { url } = t.context
  let token = await utils.signToken({ userId: image.userId }, config.secret)

  let options = {
    method: 'POST',
    uri: url,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

test('POST /:id/like', async t => {
  let image = fixtures.getImage()
  let { url } = t.context

  let options = {
    method: 'POST',
    uri: `${url}/${image.publicId}/like`,
    json: true
  }

  let body = await request(options)
  let imageNew = JSON.parse(JSON.stringify(image))
  imageNew.liked = true
  imageNew.likes = 1

  t.deepEqual(body, imageNew)
})

test('GET /list', async t => {
  let images = fixtures.getImages()
  let { url } = t.context

  let body = await request({ uri: `${url}/list`, json: true })
  t.deepEqual(body, images)
})

test('GET /tag/:tag', async t => {
  let images = fixtures.getImagesByTag()
  let { url } = t.context

  let body = await request({ uri: `${url}/tag/awesome`, json: true })
  t.deepEqual(body, images)
})
