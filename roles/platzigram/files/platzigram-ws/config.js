'use strict'

const config = {
  db: {
    host: 'localhost',
    port: process.env.PLATZIGRAM_DB_PORT,
    db: 'platzigram'
  }
}

config.db.port = config.db.port || 28015

module.exports = config
