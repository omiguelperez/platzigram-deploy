'use strict'

import page from 'page'
import title from 'title'
import empty from 'empty-element'
import Webcam from 'webcamjs'
import io from 'socket.io-client'
import picture from '../picture-card'
import template from './template'
import header from '../header'
import loading from '../loading'
import { loadAuth } from '../utils'

const socket = io.connect('http://localhost:5151')

socket.on('image', image => {
  let pictures = document.getElementById('picture-cards')
  let first = pictures.firstChild
  let img = picture(image)
  pictures.insertBefore(img, first)
})

page('/', loadAuth, header, loading, loadPictures, (ctx, next) => {
  title('Platzigram')
  let main = document.getElementById('main-container')
  empty(main).appendChild(template(ctx.pictures))

  const $shootButton = $('#shoot')
  const $cancelPictureButton = $('#cancel-picture')
  const $uploadPicturebutton = $('#upload-picture')
  const $cameraInput = $('#camera-input')
  const $preview = $('#webcam-preview')

  function reset () {
    $shootButton.removeClass('hide')
    $cameraInput.removeClass('hide')
    $cancelPictureButton.addClass('hide')
    $uploadPicturebutton.addClass('hide')
    $preview.addClass('hide')
  }

  $('.modal').modal({
    ready: () => {
      Webcam.set({
        width: 640,
        height: 480,
        dest_width: 640,
        dest_height: 480,
      })

      Webcam.attach('#camera-input')

      $shootButton.click(() => {
        Webcam.snap(dataUri => {
          $shootButton.addClass('hide')
          $cameraInput.addClass('hide')
          $cancelPictureButton.removeClass('hide')
          $uploadPicturebutton.removeClass('hide')
          $preview
            .removeClass('hide')
            .attr('src', dataUri)

          $uploadPicturebutton.off('click')
          $uploadPicturebutton.click(() => {
            const pic = {
              user: {
                username: 'omiguelperez',
                avatar: 'https://scontent.feoh2-1.fna.fbcdn.net/v/t1.0-9/23844771_1137036913093292_6957659750586754674_n.jpg?_nc_cat=0&oh=ecad5d7c4ed8993159d159cab72c9fce&oe=5BD07744'
              },
              url: dataUri,
              likes: 0,
              liked: false,
              createdAt: +Date.now()
            }

            $('#picture-cards').prepend(picture(pic))
            reset()
          })
        })
      })

      $cancelPictureButton.click(reset)
    },
    complete: () => {
      Webcam.reset()
      reset()
    }
  })
})

async function loadPictures (ctx, next) {
  try {
    ctx.pictures = await fetch('/api/pictures').then(res => res.json())
    next()
  } catch (e) {
    return console.error(e)
  }
}