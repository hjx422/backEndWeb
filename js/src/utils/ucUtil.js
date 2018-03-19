/**
 * Created by suncg on 2017/3/21.
 */
/**
 * 获取用户名信息
 * @param userInfo
 * @returns {*}
 */
function getUserName(userInfo) {
    let userName = ''
    if(typeof userInfo != 'object') return userInfo
    if(!userInfo) return userName
    if(userInfo.org && userInfo.org.real_name) {
        userName = userInfo.org.real_name
    }else if(userInfo.nick_name) {
        userName = userInfo.nick_name
    }else {
        userName = userInfo.user_id
    }
    // userName = userName + '(' + userInfo.org.org_user_code + ')'
    return userName
}

module.exports = {
    getUserName
}
