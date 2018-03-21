/**
 * Created by cpoopc on 2016/12/8.
 */
import Immutable from 'immutable'

export function get(data, key) {
  return !data ? data :
        data.get ? data.get(key) : data[key]
}


export function listSize(list) {
  if(!list) return 0
  return Immutable.List.isList(list) ? list.size :
        Array.isArray(list) ? list.length: 0
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
export function updateKeyPathData(state, keyPath, data, merge = false, deepMerge = true) {
  let newState
  let keys = keyPath.split('.').filter((str)=>str != '')
  if (merge) {
    newState = state.updateIn(keys, (value) => {
            // console.log('value:',JSON.stringify(value))
            // value若存在并且是immutable对象,则merge,否则直接设值
      if (value && value.mergeDeep) {
        return deepMerge ? value.mergeDeep(data) : value.merge(data)
      }
      return Immutable.fromJS(data)
    })
  } else {
        // 直接设值
    newState = state.setIn(keys, Immutable.fromJS(data))
  }
    // console.log('newState:', JSON.stringify((newState)))
  return newState
}


/**
 * 从obj中获取keyPath的值
 * 兼容immutable对象与普通对象
 * @param obj
 * @param keyPath
 * @returns {*}
 */
export function getIn(obj, keyPath) {
  if (!obj) return obj
  let keys = keyPath.split('.').filter((str)=>str != '')
  if (obj.getIn) {
    return obj.getIn(keys)
  } else {
    let finalObj = obj
    for (let k of keys) {
      finalObj = finalObj[k]
      if (!finalObj) return undefined
    }
    return finalObj
  }
}
