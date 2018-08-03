'use strict'

import yo from 'yo-yo'
import axios from 'axios'
import translate from '../translate'
import layout from '../layout'
import picture from '../picture-card'

export default function (pictures) {
  let el = yo`<div class="container timeline">
    <div class="row">
      <div id="camera-modal" class="modal">
        <div class="modal-content">
          <div id="camera-input"></div>
          <img id="webcam-preview" class="hide" />
        </div>
        <div class="modal-footer center-align">
          <button id="shoot" class="btn-flat">
            <i class="fa fa-camera"></i>
          </button>
          <button id="upload-picture" class="modal-close hide btn-flat cyan white-text">
            <i class="fa fa-cloud-upload"></i>
          </button>
          <button id="cancel-picture" class="hide btn-flat red white-text">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
      <div class="col s12 m10 offset-m1 l8 offset-l2 center-align">
        <form enctype="multipart/form-data" class="form-upload" id="formUpload" onsubmit=${onsubmit}>
          <a href="#camera-modal" class="waves-effect btn modal-trigger">
            <i class="fa fa-camera"></i>
          </a>
          <div id="fileName" class="fileUpload btn btn-flat cyan">
            <span><i class="fa fa-cloud-upload"></i> ${translate.message('upload-picture')}</span>
            <input type="file" name="picture" id="file" class="upload" onchange=${onchange} />
          </div>
          <button id="btnUpload" type="submit" class="btn btn-flat cyan hide">${translate.message('upload')}</button>
          <button id="btnCancel" type="button" class="btn btn-flat red hide" onclick=${cancel}>
            <i class="fa fa-times"></i>
          </button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m10 offset-m1 l6 offset-l3" id="picture-cards">
        ${pictures.map(pic => picture(pic))}
      </div>
    </div>
  </div>`

  function toggleButtons () {
    document.getElementById('fileName').classList.toggle('hide')
    document.getElementById('btnUpload').classList.toggle('hide')
    document.getElementById('btnCancel').classList.toggle('hide')
  }

  function cancel () {
    toggleButtons()
    document.getElementById('formUpload').reset()
  }

  function onchange () {
    toggleButtons()
  }

  async function onsubmit (ev) {
    ev.preventDefault()

    try {
      let data = new FormData(this)
      let opts = { method: 'POST', url: '/api/pictures', data: data }
      await axios(opts).then(response => response.data)
      cancel()
    } catch (e) {
      console.error(e)
    }
  }

  return layout(el)
}