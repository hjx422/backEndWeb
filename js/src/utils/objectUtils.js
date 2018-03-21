/**
 * Created by xlm on 2016/12/1.
 */
import update from 'react-addons-update'

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
  for (let key in obj) {
    return false
  }
  return true
}

/**
 * 对象的深拷贝
 * @param source
 * @returns {{}}
 */
export function deepCopyObject(source) {
  let result = {}
  for (let key in source) {
    result[key] = typeof source[key] === 'object' ? deepCopyObject(source[key]) : source[key]
  }
  return result
}

/**
 * 更新 state[key] 下的 name = value
 * 返回 state[key]
 * @param state
 * @param key
 * @param name
 * @param value
 * @param inPlace  true 时直接更新 state
 */
export function updateUnderKey(state, key, dict, inPlace = false) {
  let base = inPlace ? state : {}
  if (typeof dict !== 'object') return base
  if (typeof state === 'object' && state.hasOwnProperty(key)) {
    let mergedDict = Object.assign({}, state[key], dict)
    return Object.assign({}, base, { [key]: mergedDict })
  } else {
    return Object.assign({}, base, { [key]: dict })
  }
}

/**
 * 更新 state 下多组 key 里的值, state[key] 下的 name = value
 * 返回 state
 * @param state
 * @param dict { key: {name: value}}
 * @param inPlace  true 时直接更新 state
 */
export function updateMultipleKeys(state, megaDict, inPlace = false) {
  let base = inPlace ? state : {}
  if (typeof megaDict !== 'object') return base
  let result = Object.assign({}, base)
  for (let key in megaDict) {
    let dict = megaDict[key]
    if (typeof dict !== 'object') continue
    if (typeof state === 'object' && state.hasOwnProperty(key)) {
      let mergedDict = Object.assign({}, state[key], dict)
      result[key] = mergedDict
    } else {
      result[key] = dict
    }
  }
  return result
}

/**
 * 根据keyPath更新state值
 * state = {
 *  level1: {
 *      level2: 'level2'
 *  }
 * }
 * 直接更新节点值
 * updateKeyPathData(state, 'level1.level2', 'new_value_level2')
 * 若state不包含keyPath,则创建中间路径
 * updateKeyPathData(state, 'level1.level2.level3.level4', 'value_level4')
 * 
 * @param state
 * @param keyPath
 * @param data
 * @returns {*}
 */
export function updateKeyPathData(state, keyPath, data, merge = false) {
    // console.log(update({level1:{level2:{xx:11}}}, {level1:{level2:{$merge:{vv:11}}}}))
    // console.log(JSON.stringify(update({level1:{level2:{xx:11}}}, {level1:{level2:{$merge:{vv:{vvv:111}}}}})))
  let updateObj = {
  }
    // let updateTarget = state
  let keys = keyPath.split('.').filter((str)=>str != '')
  let newState
  let containAllKeyPath = true
  if(!keys.length) {
    return data 
  }
  keys.reduce((pre, cur, index)=> {
    let {mid_state, mid_updateObj} = pre
    let change = false
    mid_state = mid_state && mid_state.hasOwnProperty(cur) ? mid_state : undefined
    if(mid_state == undefined && containAllKeyPath) {
            // 从此处开始没有key值
      containAllKeyPath = false
      change = true
    }
    if (index == keys.length - 1) {
      if(containAllKeyPath) {
                // keyPath所有key都已经存在,直接设置末端值
        mid_updateObj[cur] = merge && typeof mid_state[cur] == 'object'? {$merge: data}:{$set: data}
      }else {
        mid_updateObj[cur] = data
      }
    } else {
      mid_updateObj[cur] = {}
    }
    if (change) {
                // 从此处开始$set:{ }
      if(typeof pre.mid_state == 'object') {
        updateObj = updateKeyPathData(updateObj, keys.slice(0, index).join('.'), {$merge: mid_updateObj})
      }else {
        updateObj = updateKeyPathData(updateObj, keys.slice(0, index).join('.'), {$set: mid_updateObj})
      }
                // 此后mid_updateObj为要被$set的那个值
    }
    return {
      mid_state: mid_state ? mid_state[cur] : undefined,
      mid_updateObj: mid_updateObj[cur]
    }
  }, {mid_state: state, mid_updateObj: updateObj})
  newState = update(state, updateObj)
  return newState
}

export function isKeypathExist(object, keyPath) {
  if(typeof object != 'object' && !Array.isArray(object)) return false
  let keys = keyPath.split('.').filter((str)=>str != '')
  let tempObject = object
  for(let key of keys) {
    if(!tempObject.hasOwnProperty(key)) return false
    tempObject = tempObject[key]
  }
  return true
} 
