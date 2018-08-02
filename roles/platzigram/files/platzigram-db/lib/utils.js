'use strict'

const crypto = require('crypto')

const utils = {
  extractTags,
  normalize,
  encrypt
}

function extractTags (text) {
  if (text == null) return []

  let matches = text.match(/#\w+/g)

  if (matches === null) return []

  let tags = matches.map(normalize)

  return tags
}

function normalize (text) {
  text = text.toLowerCase()
  text = text.replace(/#/g, '')
  return text
}

function encrypt (text) {
  let shasum = crypto.createHash('sha256')
  shasum.update(text)
  return shasum.digest('hex')
}

module.exports = utils
