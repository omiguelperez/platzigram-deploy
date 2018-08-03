'use strict'

import axios from 'axios'

export async function loadAuth (ctx, next) {
  try {
    let whoami = await axios('/whoami').then(res => res.data)
    
    if (whoami.username) {
      ctx.auth = whoami
    } else {
      ctx.auth = false
    }
    
    next()
  } catch (e) {
    console.error(e)
  }
}
