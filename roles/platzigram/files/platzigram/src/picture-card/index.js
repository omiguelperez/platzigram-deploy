'use strict'

import yo from 'yo-yo'
import translate from '../translate'

export default function pictureCard (pic) {
  function render (picture) {
    return yo`<div class="card picture-card ${picture.liked ? 'liked': ''}">
      <div class="card-image">
        <img src="${picture.src}" class="activator" ondblclick=${like.bind(null, null, true)} />
        <i class="fa fa-heart ${picture.likedHeart ? 'liked-heart': ''}"></i>
      </div>
      <div class="card-content">
        <a href="/${picture.user.username}" class="card-title">
          <img src="${picture.user.avatar}" class="avatar" />
          <span class="username">${picture.user.name}</span>
        </a>
        <small class="right time">${translate.date(picture.createdAt)}</small>
        <p class="likes-container">
          <a href="#" onclick="${like.bind(null, true, false)}" class="left"><i class="fa fa-heart-o"></i></a>
          <a href="#" onclick="${like.bind(null, false, false)}" class="left"><i class="fa fa-heart"></i></a>
          <span class="left likes">${translate.message('likes', { likes: picture.likes || 0 })}</span>
        </p>
      </div>
    </div>`
  }

  function like (liked, dblclick) {
    if (dblclick) {
      pic.liked = !pic.liked
      pic.likedHeart = pic.liked
    } else {
      pic.liked = liked  
    }

    const doRender = () => yo.update(el, render(pic))

    pic.likes = pic.likes || 0
    pic.likes += pic.liked ? 1 : -1

    doRender()

    if (pic.liked) {
      setTimeout(() => {
        pic.likedHeart = false;
        doRender()
      }, 1500)
    }

    return false
  }

  let el = render(pic)
  return el
}