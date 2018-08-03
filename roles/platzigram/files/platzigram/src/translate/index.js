'use strict'

import Intl from 'intl'
import 'intl/locale-data/jsonp/en-US.js'
import 'intl/locale-data/jsonp/es.js'
import IntlRelativeFormat from 'intl-relativeformat'
import IntlMessageFormat from 'intl-messageformat'
import es from './es'
import en from './en-US'

if (!window.Intl) 
  window.Intl = Intl

window.IntlRelativeFormat = IntlRelativeFormat
require('intl-relativeformat/dist/locale-data/en.js')
require('intl-relativeformat/dist/locale-data/es.js')

const MESSAGES = { es, 'en-US': en }
const locale = localStorage.locale || 'es'

export default {
  message: (text, opts) => {
    opts = opts || {}
    let msg = new IntlMessageFormat(MESSAGES[locale][text], locale)
    return msg.format(opts)
  },
  date: (date) => {
    let rf = new IntlRelativeFormat(locale)
    return rf.format(new Date(date))
  }
}