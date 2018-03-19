/**
 * Created by cpoopc on 2016/11/17.
 */
import { take, put, call, fork, race, cancelled } from 'redux-saga/effects'
import { delay, takeEvery, eventChannel, END } from 'redux-saga'
import * as actionTypes from '../actions/actionTypes.js'
import * as authSaga from './authSaga'
import * as exampleSaga from './exampleSaga.js'

export default function* rootSaga() {
    yield takeEvery(actionTypes.LOGIN_REQUEST, mapPayload(authSaga.login))
    yield takeEvery(actionTypes.GET_EXAMPLES_REQUEST, mapPayload(exampleSaga.getExamples))
}

/**
 * 提取action.payload
 * saga层直接接触参数,便于saga复用
 * @param func
 * @returns {mapFunc}
 */
function mapPayload(func) {
    return function* mapFunc(action) {
        return yield func.call(this, action.payload)
    }
}
