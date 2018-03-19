
export default {
    returnTimeString(dateString) {
        if (dateString.length < 19) {
            return ''
        }

        let s = dateString.substring(0,19).replace('T',' ').split(' ')
        let s1 = s[0].split('-')
        let s2 = s[1].split(':')
        if(s2.length==2) {
            s2.push('00')
        }

        let localDate = new Date(s1[0],s1[1]-1,s1[2],s2[0],s2[1],s2[2])
        let localTime = localDate.getTime()
        let localOffset = 28800000//一个时区 8小时的毫秒数
        let utc = localTime + localOffset
        let date = new Date(utc)

        let year = `${date.getFullYear()}`
        let month = `${date.getMonth() + 1}`
        let day = `${date.getDate()}`
        let hour = `${date.getHours()}`
        let minute = `${date.getMinutes()}`
        let seconds = `${date.getSeconds()}`

        month = month.length < 2 ? `0${month}` : month
        day = day.length < 2 ? `0${day}` : day
        hour = hour.length < 2 ? `0${hour}` : hour
        minute = minute.length < 2 ? `0${minute}` : minute
        seconds = seconds.length < 2 ? `0${seconds}` : seconds

        return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
    },

    returnNoYearString(dateString) { //'01/16 10:00' long => string
        if (dateString == '') {
            return ''
        }
        let date = new Date(dateString)

        let month = `${date.getMonth() + 1}`
        let day = `${date.getDate()}`
        let hour = `${date.getHours()}`
        let minute = `${date.getMinutes()}`

        month = month.length < 2 ? `0${month}` : month
        day = day.length < 2 ? `0${day}` : day
        hour = hour.length < 2 ? `0${hour}` : hour
        minute = minute.length < 2 ? `0${minute}` : minute

        return `${month}/${day} ${hour}:${minute}`
    },

    returnYMDHMS(dateString) { //'01/16 10:00' long => string
        if (dateString == '') {
            return ''
        }
        let date = new Date(dateString)

        let year = `${date.getFullYear()}`
        let month = `${date.getMonth() + 1}`
        let day = `${date.getDate()}`
        let hour = `${date.getHours()}`
        let minute = `${date.getMinutes()}`

        month = month.length < 2 ? `0${month}` : month
        day = day.length < 2 ? `0${day}` : day
        hour = hour.length < 2 ? `0${hour}` : hour
        minute = minute.length < 2 ? `0${minute}` : minute

        return `${year}/${month}/${day} ${hour}:${minute}`
    },

    getTodayZeroTime() {
        let date = new Date()
        date.setHours(0, 0, 0, 0)
        return date.getTime()
    },
    
    getTodayYMD() {//YYYYMMDD
        let date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        
        let year = `${date.getFullYear()}`
        let month = `${date.getMonth() + 1}`
        let day = `${date.getDate()}`

        month = month.length < 2 ? `0${month}` : month
        day = day.length < 2 ? `0${day}` : day
        
        return `${year}${month}${day}`
    },

    getDateStr(timestamp, onlyYMD=false) {
        if(timestamp == null || timestamp == '') {
            return ''
        }
        let date = new Date()
        if(timestamp.length == 10) {
            date.setTime(timestamp * 1000)
        }else {
            date.setTime(timestamp)
        }

        let year = `${date.getFullYear()}`
        let month = `${date.getMonth() + 1}`
        let day = `${date.getDate()}`
        let hour = `${date.getHours()}`
        let minute = `${date.getMinutes()}`
        let seconds = `${date.getSeconds()}`

        month = month.length < 2 ? `0${month}` : month
        day = day.length < 2 ? `0${day}` : day
        hour = hour.length < 2 ? `0${hour}` : hour
        minute = minute.length < 2 ? `0${minute}` : minute
        seconds = seconds.length < 2 ? `0${seconds}` : seconds
        if(onlyYMD) {
            return `${year}-${month}-${day}`
        } else {
            return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
        }
    },

    getTimeStamp(time) {
        if(!time) {
            time = new Date()
        }
        let timestamp = Date.parse(time)
        timestamp = timestamp / 1000
        return timestamp
    },

    formatTime(second) {
        if(second == null || second == '' || second == 0) {
            return 0
        }
        return [ parseInt(second / 60 / 60), parseInt(second / 60) % 60, second % 60 ].join(':').replace(/\b(\d)\b/g, '0$1')
    },

    returnDifferenceState(dateString) {
        if(typeof dateString != 'string') return false

        if (dateString.length < 19) return false

        let date = this.returnUTCDate(dateString)

        let utc = date.getTime()
        let currentTime = new Date().getTime()
        let timeDifference = utc - currentTime
        if (timeDifference < 0) {
            return false
        }
        return true
    },

    returnUTCDate(dateString) {
        let regexp = '([0-9]{4})(-([0-9]{2})(-([0-9]{2})' +
            '(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?' +
            '((([-+])([0-9]{2})([0-9]{2})))?)?)?)?'
        if (typeof dateString == 'undefined' || dateString.length < 19) {
            return ' '
        }
        let d = dateString.match(new RegExp(regexp))
        let offset = 0
        let date = new Date(d[1], 0, 1)

        if (d[3]) {
            date.setMonth(d[3] - 1)
        }
        if (d[5]) {
            date.setDate(d[5])
        }
        if (d[7]) {
            date.setHours(d[7])
        }
        if (d[8]) {
            date.setMinutes(d[8])
        }
        if (d[10]) {
            date.setSeconds(d[10])
        }
        if (d[12]) {
            date.setMilliseconds(Number('0.' + d[12]) * 1000)
        }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17])
            offset *= ((d[15] == '-') ? 1 : -1)
        }
        offset -= date.getTimezoneOffset()
        let time = (Number(date) + (offset * 60 * 1000))
        date = new Date(time)
        return date
    },
    getDateDiffHours(oldTimestamp, newTimestamp) {
        return Math.abs(newTimestamp - oldTimestamp) / 3600000
    },
    /**
     * 获取最小未过期时间。针对议题计划中的待讨论议题和历史议题做过滤判断条件
     * 过期时间为次日凌晨1点
     * 返回时间戳
     */
    getMinNotExpirTime() {
        let date = new Date(), tmpDate = new Date(), timestamp
        if(date.getHours() < 1) {
            tmpDate.setDate(date.getDate() - 1)
            timestamp = tmpDate.setHours(0, 0, 0, 0)
        } else {
            timestamp = date.setHours(0, 0, 0, 0)
        }
        return timestamp
    },

    /**
     * 返回明日0点时间戳
     */
    getTomorrowZeroTime() {
        let date = new Date(), tmpDate = new Date(), timestamp

        tmpDate.setDate(date.getDate() + 1)
        timestamp = tmpDate.setHours(0, 0, 0, 0)

        return timestamp
    },

    /**
     * 获取基于今天的，明天，或后天的0点时间戳
     * @param diff  1是明天，2是后天， -1是昨天
     */
    getZeroTimeBaseToday(diff) {
        let date = new Date(), tmpDate = new Date(), timestamp

        tmpDate.setDate(date.getDate() + diff)
        timestamp = tmpDate.setHours(0, 0, 0, 0)

        return timestamp
    },
    /**
     * 指定类型日期字符串转换为该日期的0点时间戳
     * 2017-03-20  -> 1489939200000
     */
    dateStrToZeroTime(dateStr) {
        if(!dateStr) {
            return null
        }
        let date = new Date(dateStr)
        let timestamp = date.setHours(0, 0, 0, 0)
        return timestamp
    }
}
