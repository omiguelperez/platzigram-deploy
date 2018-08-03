'use strict'

import page from 'page'
import title from 'title'
import axios from 'axios'
import empty from 'empty-element'
import template from './template'
import header from '../header'
import { loadAuth } from '../utils'

page('/:username', loadAuth, header, loadUser, (ctx, next) => {
  title(`Platzigram - ${ctx.user.username}`)
  let main = document.getElementById('main-container')
  empty(main).appendChild(template(ctx.user))
})

page('/:username/:id', loadAuth, header, loadUser, async (ctx, next) => {
  title(`Platzigram - ${ctx.user.username}`)
  let main = document.getElementById('main-container')
  empty(main).appendChild(template(ctx.user))

  $(`#modal-${ctx.params.id}`).modal({
    complete: () => page(`/${ctx.params.username}`)
  }).modal('open')
})

async function loadUser (ctx, next) {
  try {
    ctx.user = await axios(`/api/user/${ctx.params.username}`).then(res => res.data)
    next()
  } catch (e) {
    console.error(e)
  }
}
