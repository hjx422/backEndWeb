/**
 * Created by xlm on 2016/11/4.
 */

export default {
  containerSlide(isDelay) {
    let target = document.getElementById('containerBox')
    let checkList = document.getElementById('checkList')
    let stepList = document.getElementById('stepList')
    let duration = isDelay ? '300ms' : '0ms'
    if(target && checkList && stepList) {
            //target.style.width = width
            //target.style.left = shift

      target.style.transitionDuration = duration
      target.style.webkitTransitionDuration = duration
      target.style.MozTransitionDuration = duration
      target.style.msTransitionDuration = duration
      target.style.OTransitionDuration = duration

      checkList.style.transitionDuration = duration
      checkList.style.webkitTransitionDuration = duration
      checkList.style.MozTransitionDuration = duration
      checkList.style.msTransitionDuration = duration
      checkList.style.OTransitionDuration = duration

      stepList.style.transitionDuration = duration
      stepList.style.webkitTransitionDuration = duration
      stepList.style.MozTransitionDuration = duration
      stepList.style.msTransitionDuration = duration
      stepList.style.OTransitionDuration = duration
    }
  }
}
