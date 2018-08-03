'use strict'

const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const platzigram = require('platzigram-client')
const jwt = require('jsonwebtoken')
const config = require('../config')

const client = platzigram.createClient(config.client)

exports.localStrategy = new LocalStrategy((username, password, done) => {
  client.auth(username, password, (err, token) => {
    if (err) return done(null, false, { error: 'username or password not found' })

    client.getUser(username, (err, user) => {
      if (err) return done(null, false, { error: `an error ocurred: ${err.message}` })

      user.token = token
      done(null, user)
    })
  })
})

exports.facebookStrategy = new FacebookStrategy({
  clientID: config.auth.facebook.clientID,
  clientSecret: config.auth.facebook.clientSecret,
  callbackURL: config.auth.facebook.callbackURL,
  profileFields: ['id', 'displayName', 'email']
}, (accessToken, refreshToken, profile, done) => {
  let userProfile = {
    username: profile._json.id,
    name: profile._json.name,
    email: profile._json.email,
    facebook: true
  }

  findOrCreate(userProfile, (err, user) => {
    if (err) return done(err)

    jwt.sign({ userId: user.username }, config.secret, {}, (err, token) => {
      if (err) return done(err)

      user.token = token
      done(null, user)
    })
  })
  
  function findOrCreate (user, callback) {
    client.getUser(user.username, (err, usr) => {
      if (err) return client.saveUser(user, callback)
      callback(null, usr)
    })
  }
})

exports.serializeUser = function (user, done) {
  done(null, {
    username: user.username,
    token: user.token
  })
}

exports.deserializeUser = function (user, done) {
  client.getUser(user.username, (err, usr) => {
    if (err) return done(err)

    usr.token = user.token
    done(null, usr)
  })
}
