'use strict'

/**
 * 提供以下服务
 *
 * - 内容长度验证
 * - 内容内容安全转义
 * - 内容内容转HTML
 */

const URL = Symbol('url')
const NEWLINE= Symbol('newline')
const SPACE = Symbol('sep')
const SPECIAL = Symbol('special')
const TEXT = Symbol('text')
const UNKNOWN = Symbol('unknonw')

let renderRules = {
    [URL] : urlHandler(),
    [NEWLINE] : newlineHandler(),
    [SPACE] : (sep) => sep.replace(/\s/g, '&nbsp;')
}

// source: https://gist.github.com/dperini/729294
// modified disallowing chinese and other unicode
// 注意: 域名的部分不允许汉字但是查询字符串是允许的
// 注意2: url 的规范是允许在 hostname 的部分使用汉字的
let urlRegExp = new RegExp(
    '^' +
        // protocol identifier
    '(?:(?:https?|ftp|cmp)://)' +
        // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
        // IP address exclusion
        // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
        // host name
    '(?:(?:[a-z0-9]-*)*[a-z0-9]+)' +
        // domain name
    '(?:\\.(?:[a-z0-9]-*)*[a-z0-9]+)*' +
        // TLD identifier
    '(?:\\.(?:[a-z]{2,}))' +
        // TLD may end with dot
    '\\.?' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
        // resource path
    '(?:[/?#]\\S*)?'
    , 'i'
)

// main rules
const url = {
    label: URL,
    //pattern: /^\s*https?:\/\/[^ <>]{4,512}/ //最多 512 个
    pattern: urlRegExp
}
const special    = {
    label: SPECIAL,
    pattern: /^[-$\\@#\[\]\(\)\{\};<>\/]/
}

const nonspecial = {
    label: TEXT,
    pattern: /^[^-$\\@#\[\]\(\)\{\};<>\/ \n\r]+/
}
const sep = {
    label: SPACE,
    pattern: /^[ \t]+/
}
const newline = {
    label: NEWLINE,
    pattern: /^(\r\n|\r|\n)+/
}
// subrules
const escape = /^[`'"\\<>&]/  // nonspecial 跟 special 里都有要 escape 的
const alphanumpunc = /[0-9A-Za-z~!@#$%^&*()-=+.,;:?_\/\\\(\)\[\]`'"]/

const parseOrder = [ url, nonspecial, special, sep, newline ]

/**
 * TODO: streaming api
 * @param text
 * @param rules
 * @returns {Array}
 */
function tokenize(text, rules = parseOrder) {

        // token ## []
        // url
        // 英文字符串、标点
        // 中文字符串
        // 内容长度 140
        // escape
    let lines = text.split(/(\r\n|\n)/)
    let data = []
    for(let idx in lines) {
        //if(idx > 0) data.push(['newline', '']); // preserve newline
        for (let i = 0; i < lines[idx].length;) {
            let chunk = lines[idx].slice(i)
            let match = rules.some(item => {
                if(item.pattern.test(chunk)) {
                    let matchObject = chunk.match(item.pattern)
                    i += matchObject[0].length
                    data.push([ item.label, matchObject[0] ])
                    return true
                }
                return false
            })
            if(!match) {
                data.push([ UNKNOWN, chunk[i] ])
                i++
            }
        }
    }
    return data
}

/**
 *
 * @param text
 */
function textLength(text) {
    let count = 0.0
    for (let i in text) {
        //if(alphanumpunc.test(text[i])) {
        //    count += 0.5
        //}else {
        count += 1
        //}
    }
    return count
}

/**
 * 英文字符1个，中文字符1个
 */
function msgLength(msgText) {
    let tokens = tokenize(msgText)
    let count = 0
    for (let i in tokens) {
        let item = tokens[i]
        let [ label, text ] = item
        switch (label) {
        case URL:
            count += 4
            break
        case SPACE:
            count += text.length * 0.5
                // count += 1; // 1 个或多个空格算 1
            break
        default:
            count += textLength(text)
            break
        }
    }
    return count
}

function difTextLength(text) {
    let count = 0.0
    for (let i in text) {
        if(alphanumpunc.test(text[i])) {
            count += 1
        }else {
            count += 2
        }
    }
    return count
}

/**
 * 英文字符1个，中文字符2个，空格1个
 */
function difMsgLength(msgText) {
    let tokens = tokenize(msgText)
    let count = 0
    for (let i in tokens) {
        let item = tokens[i]
        let [ label, text ] = item
        switch (label) {
        case SPACE:
            count += text.length * 1
            // count += 1; // 1 个或多个空格算 1
            break
        default:
            count += difTextLength(text)
            break
        }
    }
    return count
}

function _escape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;')
        .replace(/\`/g, '&#96;')
}

function _unescape(str) {
    return str
        .replace(/&#96;/ig, '`')
        .replace(/&#x2F;/ig, '/')
        .replace(/&gt;/ig, '>')
        .replace(/&lt;/ig, '<')
        .replace(/&#x27;/ig, '\'')
        .replace(/&quot;/ig, '"')
        .replace(/&amp;/ig, '&')
}

/**
 * 在发送到服务端之前清理 & <> " ' ` / 等字符
 */
function msgEscape(str) {
    let tokens = tokenize(str)
    let data = []
    tokens.forEach((item, idx) => {
        let [ label, token ] = item
        if(label == TEXT || label == SPECIAL) {
            data.push(_escape(token))
        }else if(label == NEWLINE) {
            data.push(token)
        }else {
            data.push(token)
        }
    })
    return data.join('')
}

function msgUnescape(str) {
    return _unescape(str)
}

/**
 * options = {class: xxx, href: xxx: alt:xxx, title:xxx, target:xxx, text:xxx, rawText: 原始字串}
 *
 * @param options
 * @returns {*}
 */
function idTemplate(options) {
    return options.text
}

function hrefTemplate(options)  {
    return `<a class="${options.class}" href="${options.href}">${options.text}</a>`
}

function userHandler(template = hrefTemplate) {
    return userStr => {
        let userId = userStr.replace(/^<M (\d+)>(@.*)<\/M>/i, '$1')
        let userTag = userStr.replace(/^<M (\d+)>(@.*)<\/M>/i, '$2')
        // TODO : supporting template
        return template({ class:'wb-at', href:`#/users/${userId}`, text: userTag })
    }
}

function urlHandler(template = hrefTemplate) {
    return text =>
        template({ class:'wb-url', href:text, text: '链接' })
}

function truncateUrl(url, length=20) {
    if(url.length > length) {
        return url.slice(0,length) + '...'
    }
    return url
}

function newlineHandler(template=idTemplate) {
    return newlines =>
        template({ text: newlines.replace(/(\r\n|\r|\n)/g, '<br />') })
}

/**
 * url truncate + <a href>
 *
 *  注意： 不对特殊字符 <>'" 转义，取到的应该是已经转义过的字串
 * 支持options 传模板
 */
function renderHtml(str, options={}) {
    let tokens = tokenize(str)
    let data = []

    tokens.forEach((item, idx) => {
        let [ label, token ] = item
        if (renderRules[label]) {
            data.push(renderRules[label](token))
        }else {
            data.push(token)
        }
    })
    return data.join('')
}

/**
 * 截断内容保留 140 个字，英文字符1个，中文字符1个
 */
function truncateMsg(text, toLength=140) {

    let tokens = tokenize(text)
    let count = 0
    let data = []
    let i
    let testcount
    for (i in tokens) {
        let [ label, token ] = tokens[i]
        switch (label) {
        case URL:
            count += 4
            break
        case SPACE:
            count += token.length * 0.5
                // count += 1; // 1 个或多个空格算 1
            break
        default:
            testcount = count + textLength(token)
            if (testcount > toLength) {
                let keepidx = 0
                token.split('').some((char,idx)=>{
                    if(count + textLength(token.slice(0, idx)) <= toLength) {
                        keepidx = idx
                        return false
                    }
                    return true
                })
                data.push(token.slice(0, keepidx))
            }
            count = testcount
            break
        }
        if (count > toLength) {
            break
        }else {
            data.push(token)
        }
    }

    return data.join('')
}

/**
 * 截断内容保留 140 个字，英文字符1个，中文字符2个，空格1个
 */
function difTruncateMsg(text, toLength=140) {

    let tokens = tokenize(text)
    let count = 0
    let data = []
    let i
    let testcount
    for (i in tokens) {
        let [ label, token ] = tokens[i]
        switch (label) {
        case SPACE:
            count += token.length * 1
            // count += 1; // 1 个或多个空格算 1
            break
        default:
            testcount = count + difTextLength(token)
            if (testcount > toLength) {
                let keepidx = 0
                token.split('').some((char,idx)=>{
                    if(count + difTextLength(token.slice(0, idx)) <= toLength) {
                        keepidx = idx
                        return false
                    }
                    return true
                })
                data.push(token.slice(0, keepidx))
            }
            count = testcount
            break
        }
        if (count > toLength) {
            break
        }else {
            data.push(token)
        }
    }

    return data.join('')
}

const symbols = {
    URL,
    NEWLINE,
    SPACE,
    SPECIAL,
    TEXT,
    UNKNOWN
}

export {
    tokenize,
    msgLength,
    difMsgLength,
    msgEscape,
    msgUnescape,
    renderHtml,
    truncateMsg,
    difTruncateMsg,
    symbols
}
