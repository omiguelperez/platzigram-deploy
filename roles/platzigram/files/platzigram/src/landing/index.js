'use strict'

import yo from 'yo-yo'

export default function landing (box) {
  return yo`<div class="container landing">
    <div class="row">
      <div class="col s10 push-s1">
        <div class="row">
          <div class="col m5 hide-on-small-only">
            <figure class="iphone-container">
              <img src="/images/iphone.png" class="iphone">
            </figure>
          </div>
          ${box}
        </div>
      </div>
    </div>
  </div>`
}