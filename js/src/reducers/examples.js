/**
 * Created by hjx on 7/31/2017.
 */
import { combineReducers } from 'redux'
import * as actionTypes from '../actions/actionTypes.js'

export default function examples(state = [], action) {
  switch (action.type) {
  case actionTypes.GET_EXAMPLES_SUCCESS:
    return action.response
  default :
    return state
  }
}
