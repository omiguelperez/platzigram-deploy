'use strict'

import yo from 'yo-yo'
import translate from '../translate'

export default function layout (content) {
  return yo`<div class="content">
    ${content}
  </div>`
}