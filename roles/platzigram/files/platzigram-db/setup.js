'use strict'

const Db = require('.')
const config = require('./config')

config.db.setup = true

const db = new Db(config.db)

db.connect()
  .then(() => {
    console.log('Database setup')
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })

