import CONFIG from '../constants/config'
import BaseService from '../services/baseService'
import $ from 'jquery'

export default new class CsService extends BaseService {

    uploadFile(res, fileData) {
        console.log(fileData)
        const endpoint = `upload?session=${res.session}`
        const url = `http://${CONFIG.cs.host}/${CONFIG.cs.version}/${endpoint}`
        fileData.append('path', res.path)
        fileData.append('scope', 1)
        return $.ajax({
            url: url,
            type: 'post',
            data: fileData,
            cache: false,
            contentType: false,
            processData: false
        })
    }

    uploadFiles(res, datas) {
        const endpoint = `upload?session=${res.session}`
        const url = `http://${CONFIG.cs.host}/${CONFIG.cs.version}/${endpoint}`
        let promises = []
        for(let imgData of datas) {
            imgData.append('path', res.path)
            imgData.append('scope', 1)
            promises.push($.ajax({
                url: url,
                type: 'post',
                data: imgData,
                cache: false,
                contentType: false,
                processData: false
            }))
        }
        return Promise.all(promises).then(function (res) {
            return res
        })
    }


    /**
     * 获取目录信息
     * @param dentryId
     * @param session
     * @returns {*}
     */
    getDentryInfo(dentryId, session) {
        let endpoint = `dentries/${dentryId}`
        if (session) {
            endpoint += `?session=${session}`
        }
        const apiUrl = `http://${CONFIG.cs.host}/${CONFIG.cs.version}/${endpoint}`
        return super.request({ apiUrl, method:'GET', withAuthToken:true })
    }
}
