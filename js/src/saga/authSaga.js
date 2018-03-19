import authUtils from '../utils/authUtils'
import { put, take, call, select } from 'redux-saga/effects'
import * as actionTypes from '../actions/actionTypes.js'
import { decamelizeKeys, camelizeKeys } from 'humps'
import ucService from '../services/ucService.js'

export function* login({userName, passwords}) {
    try {
        let response = yield ucService.login(userName, passwords)
        response = camelizeKeys(response)
        let name = response['nickName'] || response['realName']
        let orgId = response['orgId']
        authUtils.saveAuth(response['accessToken'],
            response['macKey'],
            response['expiresAt'],
            response['refreshToken'],
            {
                id: response['userId'],
                name,
                orgId: orgId,
                roles: response['roles']
            }
        )
        yield put({type: actionTypes.LOGIN_SUCCESS, response})
    } catch(error) {
        yield put({type: actionTypes.LOGIN_FAILURE, error})
    }
}
