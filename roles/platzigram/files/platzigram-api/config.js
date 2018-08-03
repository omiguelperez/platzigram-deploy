module.exports = {
  db: {
    host: process.env.PLATZIGRAM_DB_HOST,
    port: process.env.PLATZIGRAM_DB_PORT,
    db: process.env.PLATZIGRAM_DB_NAME
  },
  secret: process.env.PLATZIGRAM_SECRET
}
