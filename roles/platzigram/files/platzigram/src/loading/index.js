'use strict'

import yo from 'yo-yo'
import empty from 'empty-element'

const template = yo`<div class="loader"></div>`

export default function loading (ctx, next) {
  let main = document.getElementById('main-container')
  empty(main).appendChild(template)
  next()
}