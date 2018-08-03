'use strict'

import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import fixtures from './fixtures'
import users from '../users'

test.beforeEach(async t => {
  let srv = t.context.srv = micro(users)
  t.context.url = await listen(srv)
})

test.afterEach(t => {
  t.context.srv.close()
})

test('POST /', async t => {
  let { url } = t.context
  let user = fixtures.getUser()

  let options = {
    method: 'POST',
    uri: url,
    body: {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password
    },
    json: true,
    resolveWithFullResponse: true
  }

  let response = await request(options)

  delete user.email
  delete user.password

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, user)
})

test('GET /:username', async t => {
  let user = fixtures.getUser()
  let { url } = t.context

  let body = await request({ uri: `${url}/${user.username}`, json: true })

  delete user.email
  delete user.password

  t.deepEqual(body, user)
})
