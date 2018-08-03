'use strict'

import page from 'page'
import empty from 'empty-element'
import title from 'title'
import template from './template'

page('/signup', (ctx, next) => {
  title('Platzigram - Signup')
  let main = document.getElementById('main-container')
  empty(document.getElementById('site-header'))
  empty(main).appendChild(template)
})