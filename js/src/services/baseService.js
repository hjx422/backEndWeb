/**
 * Created by Administrator on 2015/12/7.
 */

import CONFIG from '../constants/config'
import authUtils from '../utils/authUtils'
import { Schema, arrayOf, normalize } from 'normalizr'
import { result, camelizeKeys } from 'humps'
import fetch from 'isomorphic-fetch'

export default class {

    request({ apiUrl, body, method='get', withAuthToken=true, host=null }) {
        const _method = method.toUpperCase()

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        }
        //let auth = store.getState().auth
        //if(auth && auth.auth.orgName && auth.auth.orgName.length > 0) {
        //    withAuthToken = false
        //    headers['orgname'] = auth.auth.orgName
        //}
        if (withAuthToken) {
            let auth = headers['Authorization'] = authUtils.getAuthHeader({ url:apiUrl, method:_method, host })
        }

        let settings = {
            method: _method,
            headers: headers
        }

        if (![ 'get', 'head' ].includes(_method) && body) {
            settings['body'] = JSON.stringify(body)
        }
        //解决过滤条件中包含+号会被转成空格的问题
        apiUrl = apiUrl.replace(/\+/g, '%2B')

        return fetch(apiUrl, settings).then(response => {
            let json = response.json()
            return json.then(json => {
                return { json, response }
            }).then(({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json
            }).catch(e => {
                if (response.ok) {
                    return {}
                } else {
                    return Promise.reject(e)
                }
            })
        })
    }

    postFile({ apiUrl, body, withAuthToken=true, host=null }) {
        const _method = 'post'
        let headers = {
            'Content-Type': 'multipart/form-data'
        }
        if (withAuthToken) {
            let auth = headers['Authorization'] = authUtils.getAuthHeader({ url:apiUrl, method:_method, host })
            console.info(auth)
        }
        let settings = {
            method: _method,
            headers: headers
        }
        if (body) {
            settings['body'] = JSON.stringify(body)
        }
        return fetch(apiUrl, settings)
    }

    ufRequest({endpoint, body, method='get', withAuthToken=true}) {
        let apiUrl = `http://${CONFIG.uf.host}/${CONFIG.uf.version}/applications/${CONFIG.app.code}/${endpoint}`
        return this.request({apiUrl, body, method, withAuthToken})
    }

    clRequest({endpoint, body=null, method='get', withAuthToken=true}) {
        const apiUrl = `http://${CONFIG.cl.host}/${CONFIG.cl.version}/${endpoint}`
        return this.request({apiUrl, body, method, withAuthToken})
    }

}
