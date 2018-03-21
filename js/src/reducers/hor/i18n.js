/**
 * Created by hjx on 7/28/2017.
 */
import { combineReducers } from 'redux'
import * as LANG from '../../constants/lang.js'

function filterActionByLang(reducer, lang) {
  function filter(state = {}, action) {
    if (action.meta && action.meta.lang === lang) {
      return reducer(state, action)
    } else {
      return reducer(state, {})
    }
  }
  return filter
}

function splitActionsFlowByLang(reducer, langs) {
  const splitter = {}
  langs.forEach((lang) => {
    splitter[lang] = filterActionByLang(reducer, lang)
  })
  return splitter
}

export default function i18n(reducers) {
  return splitActionsFlowByLang(combineReducers(reducers), Object.keys(LANG).map((key) => LANG[key]))
}
