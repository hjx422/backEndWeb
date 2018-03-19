/**
 * Created by hjx on 7/27/2017.
 */
import { combineReducers } from 'redux'
import * as lang from '../constants/lang.js'
import * as actionTypes from '../actions/actionTypes.js'

function curLang(state = lang.ZH, action) {
    switch (action.type) {
    case actionTypes.SWITCH_LANGUAGE:
        return state === lang.ZH ? lang.EN : lang.ZH
    default :
        return state
    }
}

export default combineReducers({
    curLang
})
