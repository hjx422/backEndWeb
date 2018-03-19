import CONFIG from '../constants/config'
import systemService from '../services/systemService.js'

// 系统级session获取，及定时刷新，待全局重构
export function setCsSessionRes() {
    systemService.getSession().then(function (res1) {
        window.localStorage.csSessionRes = JSON.stringify(res1)
    })
    setTimeout(()=> {
        console.log('#刷新session')
        setCsSessionRes()
    },50*60*1000)//50分钟
}

//获取sessionRes对象
export function getCsSessionRes() {
    let result = {}
    let csSessionRes = window.localStorage.csSessionRes
    if(csSessionRes) {
        result =  JSON.parse(csSessionRes)
    }
}
//只获取session
export function getCsSession() {
    return getCsSessionRes().session
}

export function getCsUrlByDentry(dentryId, session) {
  // console.log(dentryId, session);
    let endpoint = `download?dentryId=${dentryId}`
    if (session) {
        endpoint += `&session=${session}`
    }
    const url = `http://${CONFIG.cs.host}/${CONFIG.cs.version}/${endpoint}`
    return url
}

export function getCsThumbnailUrlByDentry(dentryId, session, size = 80, addition) {
    let endpoint = `download?dentryId=${dentryId}&size=${size}`
    if(addition && addition != '' && addition != '{}') {
        try {
            let additionObject = JSON.parse(addition)
            if(additionObject[dentryId] && additionObject[dentryId].toLocaleLowerCase() == 'gif') {
                endpoint += '&ext=jpg'
            }
        } catch(e) {
            // do nothing
        }
    }
    if (session) {
        endpoint += `&session=${session}`
    }
    const url = `http://${CONFIG.cs.host}/${CONFIG.cs.version}/${endpoint}`
    return url
}

export function getCsUrlByPath(path, session) {
    let endpoint = `static${path}`
    if (session) {
        endpoint = `${session}/` + endpoint
    }
    const url = `http://${CONFIG.cs.host}/${CONFIG.cs.version}/${endpoint}`
    return url
}
