'use strict'

import yo from 'yo-yo'
import landing from '../landing'
import translate from '../translate'

const signinForm = yo`<div class="col s12 m7">
  <div class="row">
    <div class="signup-box">
      <h1 class="platzigram">Platzigram</h1>
      <form class="signup-form" action="/login" method="POST">
        <div class="section">
          <a href="/auth/facebook" rel="external" class="btn btn-fb hide-on-small-only">${translate.message('signup.facebook')}</a>
          <a href="/auth/facebook" rel="external" class="btn btn-fb hide-on-med-and-up">
            <i class="fa fa-facebook-official"></i>
            ${translate.message('signup.text')}
          </a>
        </div>
        <div class="divider"></div>
        <div class="section">
          <input type="text" name="username" placeholder="${translate.message('username')}">
          <input type="password" name="password" placeholder="${translate.message('password')}">
          <button type="submit" class="btn waves-effect waves-light btn-signup">${translate.message('signin.call-to-action')}</button>
        </div>
      </form>
    </div>
  </div>
  <div class="row">
    <div class="login-box">
      ${translate.message('signin.not-have-account')} <a href="/signup">${translate.message('signup.text')}</a>
    </div>
  </div>
</div>
`

export default landing(signinForm)