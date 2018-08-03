'use strict'

import yo from 'yo-yo'
import translate from '../translate'

const template = yo`<div class="container">
  <div class="row">
    <div class="col s12 l3 center-align">
      <a href="#" data-activates="dropdown-language" class="dropdown-button btn btn-flat">
        ${translate.message('language')}
      </a>
      <ul id="dropdown-language" class="dropdown-content">
        <li><a href="#" onclick="${lang.bind(null, 'es')}">${translate.message('spanish')}</a></li>
        <li><a href="#" onclick="${lang.bind(null, 'en-US')}">${translate.message('english')}</a></li>
      </ul>
    </div>
    <div class="col s12 l3 push-l6 center-align">® 2017 Platzigram</div>
  </div>
</div>`

function lang (locale) {
  localStorage.locale = locale
  location.reload()
}

let footer = document.getElementById('site-footer')

footer.appendChild(template)

