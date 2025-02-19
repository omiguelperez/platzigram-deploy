'use strict'

const config = {
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },
  secret: process.env.PLATZIGRAM_SECRET,
  client: {
    endpoints: {
      pictures: 'http://api.platzigram.com/picture',
      users: 'http://api.platzigram.com/user',
      auth: 'http://api.platzigram.com/auth'
    }
  },
  auth: {
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://platzigram.com/auth/facebook/callback'
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  config.client.endpoints = {
    pictures: 'http://localhost:5000',
    users: 'http://localhost:5001',
    auth: 'http://localhost:5002'
  }

  config.auth.facebook.callbackURL = 'http://localhost:5050/auth/facebook/callback'
}

module.exports = config