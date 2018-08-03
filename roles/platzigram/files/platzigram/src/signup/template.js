'use strict'

import yo from 'yo-yo'
import landing from '../landing'
import translate from '../translate'

const signupForm = yo`<div class="col s12 m7">
  <div class="row">
    <div class="signup-box">
      <h1 class="platzigram">Platzigram</h1>
      <form class="signup-form" action="/signup" method="POST">
        <h2>${translate.message('signup.subheading')}</h2>
        <div class="section">
          <a class="btn btn-fb hide-on-small-only">${translate.message('signup.facebook')}</a>
          <a class="btn btn-fb hide-on-med-and-up">
            <i class="fa fa-facebook-official"></i>
            ${translate.message('signup.text')}
          </a>
        </div>
        <div class="divider"></div>
        <div class="section">
          <input type="email" name="email" placeholder="${translate.message('email')}">
          <input type="text" name="name" placeholder="${translate.message('fullname')}">
          <input type="text" name="username" placeholder="${translate.message('username')}">
          <input type="password" name="password" placeholder="${translate.message('password')}">
          <button type="submit" class="btn waves-effect waves-light btn-signup">${translate.message('signup.call-to-action')}</button>
        </div>
      </form>
    </div>
  </div>
  <div class="row">
    <div class="login-box">
      ${translate.message('signup.have-account')} <a href="/signin">${translate.message('signin')}</a>
    </div>
  </div>
</div>
`

export default landing(signupForm)