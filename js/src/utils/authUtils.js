//import Crypto from 'crypto-js';
import HmacSHA256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'
//import {'hmac-sha256' as HmacSHA256, 'enc-base64' as Base64 } from 'crypto-js.hmac-sha256';

export default {
    getAuthHeader({ url, accessToken, macKey, host=null, method='get' }) {
        //URI转码
        url = encodeURI(url)

        //解决过滤条件中包含+号会被转成空格的问题
        url = url.replace(/\+/g, '%2B')
        /**
         * @return {Promise}
         */
        let localToken = {}
        if(localStorage.token) {
            //try
            //{
            //    localToken = JSON.parse(localStorage.token);
            //}catch(e){
            //    localStorage.removeItem('token');
            //}
        }

        let _accessToken = accessToken || localStorage.access_token
        let _macKey = macKey || localStorage.mac_key

        if (!_accessToken || !_macKey) {
            return null
        }

        if (!HmacSHA256) {
            console.error('please include crypto lib in the page.')
        }

        let strAuth = `MAC id="${_accessToken}",nonce="`
        let nonce = new Date().getTime() + ':' + this.randomCode()
        strAuth += nonce + '",mac="'

        let path
        let pos = url.indexOf('://')
        if (pos > 0) {// for cross domain requesting
            path = url.substring(pos + 3)
            pos = path.indexOf('/')
            host = path.substr(0, pos)
            path = path.substring(pos)
        } else {
            if(!host) {
                console.error('parameter "host" is missed.')
                return null
            }
            path = url
        }
        let requestContent = nonce + '\n' + method.toUpperCase()  + '\n' + path + '\n' + host + '\n'
        let hash = HmacSHA256(requestContent, _macKey)
        let mac = hash.toString(Base64)
        strAuth += mac + '"'
        return strAuth

    },

    randomCode() {
        let code = ''
        let codeLength = 8//验证码的长度
        let chars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]
        //所有候选组成验证码的字符，当然也可以用中文的

        for (let i = 0; i < codeLength; i++) {
            let charIndex = Math.floor(Math.random() * 36)
            code += chars[charIndex]
        }
        return code
    },
    saveAuth(accessToken, macKey, expiresAt, refreshToken, userInfo={}) {
        localStorage.user_info = JSON.stringify(userInfo)
        localStorage.access_token = accessToken
        localStorage.mac_key = macKey
        localStorage.expires_at = expiresAt
        localStorage.refresh_token = refreshToken
    },
    getAuth() {
        return {
            userInfo : localStorage.user_info ? JSON.parse(localStorage.user_info) : null,
            accessToken : localStorage.access_token || null,
            macKey : localStorage.mac_key || null,
            expiresAt : localStorage.expires_at || null,
            refreshToken: localStorage.refresh_token || null
        }
    },
    cleanAuth() {
        delete localStorage.user_info
        delete localStorage.access_token
        delete localStorage.mac_key
        delete localStorage.expires_at
        delete localStorage.refresh_token
    }
}
