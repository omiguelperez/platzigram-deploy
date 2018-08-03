'use strict'

import yo from 'yo-yo'
import empty from 'empty-element'
import translate from '../translate'

const authCard = function (ctx) {
  let authenticated = yo`<div class="col s2 m3 push-m3">
    <a class="dropdown-button btn btn-large btn-flat" data-activates="drop-user">
      <i class="fa fa-user"></i>
    </a>
    <ul id="drop-user" class="dropdown-content">
      <li><a href="/logout" rel="external">${translate.message('logout')}</a></li>
    </ul>
  </div>`

  let signin = yo`<div class="col s2 m3 push-m3">
    <a href="/signin" class="btn btn-large btn-flat">
      ${translate.message('signin')}
    </a>
  </div>`

  if (ctx.auth) return authenticated

  return signin
}

const renderHeader = function (ctx) {
  return yo`<nav class="header">
    <div class="nav-wrapper">
      <div class="container">
        <div class="row">
          <div class="col s10 m6 offset-m1">
            <a href="/" class="brand-logo platzigram">Platzigram</a>
          </div>
          ${authCard(ctx)}
        </div>
      </div>
    </div>
  </nav>`
}

export default function header (ctx, next) {
  let container = document.getElementById('site-header')
  empty(container).appendChild(renderHeader(ctx))
  $('.dropdown-button').dropdown()
  next()
}
