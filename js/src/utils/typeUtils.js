/**
 * Created by xlm on 2017/1/10.
 */

export function boolean(key, bool) {
  return (typeof key === 'boolean' ? key : bool)
}

export function numberOrString(data) {
  return (typeof data === 'number' || typeof data === 'string') ? true : false
}

export function typeFilter(value, filter = []) {
  let flag = true
  if(filter) {
    filter.map((type, index) => {
      if(typeof value !== type) {
        flag = false
      }
    })
  }
  if(!flag) return false

  return true
}
