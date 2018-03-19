/**
 * Created by cpoopc on 2016/9/27.
 */
export default {
    getElementLeft(element) {
        let actualLeft = element.offsetLeft
        let current = element.offsetParent

        while (current !== null) {
            actualLeft += current.offsetLeft
            current = current.offsetParent
        }

        return actualLeft
    },

    getElementViewLeft(element) {
        let actualLeft = this.getElementLeft(element)
        let elementScrollLeft = element.scrollLeft
        let current = element.parentNode
        while(current != null) {
            elementScrollLeft += current.scrollLeft ? current.scrollLeft : 0
            current = current.parentNode
        }
        return actualLeft-elementScrollLeft
    },

    getElementTop(element) {
        let actualTop = element.offsetTop
        let current = element.offsetParent

        while (current !== null) {
            actualTop += current.offsetTop
            current = current.offsetParent
        }

        return actualTop
    },

    getElementViewTop(element) {
        let actualTop = this.getElementTop(element)
        let elementScrollTop = element.scrollTop
        let current = element.parentNode
        while(current != null) {
            elementScrollTop += current.scrollTop ? current.scrollTop : 0
            current = current.parentNode
        }
        return actualTop-elementScrollTop
    },

    getStyle(element, attr) {
        return window.getComputedStyle ? window.getComputedStyle(element, null)[attr] : element.currentStyle[attr]
    }
}
