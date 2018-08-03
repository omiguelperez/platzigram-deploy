'use strict'

import yo from 'yo-yo'
import layout from '../layout'

export default function userPage (user) {
  let el = yo`<div class="container user-page">
    <div class="row">
      <div class="col s12 m10 offset-m1 l8 offset-l2 heading">
        <div class="row profile">
          <div class="col s12 m10 offset-m1 l3 offset-l2 center-align">
            <img src="${user.avatar}" class="responsive-img circle" alt="${user.username}" />
          </div>
          <div class="col s12 m10 offset-m1 l7">
            <h2 class="hide-on-med-and-down left-align">${user.name}</h2>
            <h2 class="hide-on-large-only center-align">${user.name}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      ${user.pictures.map(picture => {
        return yo`<div class="col s12 m6 l4">
          <a href="/${user.username}/${picture.id}" class="picture-container">
            <img src="${picture.src}" class="picture" />
            <div class="likes"><i class="fa fa-heart"> ${picture.likes}</i></div>
          </a>
          <div id="modal-${picture.id}" class="modal">
            <div class="modal-content modal-picture-container">
              <img class="responsive-img" src="${picture.src}" />
            </div>
          </div>
        </div>`
      })}
    </div>
  </div>`

  return layout(el)
}