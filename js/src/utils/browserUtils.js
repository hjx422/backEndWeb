export function isSafari(str) {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function addHandler(target, eventType, handler) {
  let addHandler
  if(target.addEventListener) {
    addHandler = (target, eventType, handler) => {
      target.addEventListener(eventType, handler, false)
    }
  }else {
    addHandler = (target, eventType, handler) => {
      target.attachEvent('on'+eventType, handler)
    }
  }
  addHandler(target, eventType, handler)
}

/**
 *
 * @param target
 * @param eventType
 * @param handler
 */

export function removeHandler(target, eventType, handler) {
  let removeHandler
  if(target.addEventListener) {
    removeHandler = (target, eventType, handler) => {
      target.removeEventListener(eventType, handler, false)
    }
  }else {
    removeHandler = (target, eventType, handler) => {
      target.detachEvent('on'+eventType, handler)
    }
  }
  removeHandler(target, eventType, handler)
}
