import React from 'react'
import styles from 'styles/components/common/toast/toast.css'
import { intlShape,defineMessages } from 'react-intl'
import IntlUtil from 'i18n/intlUtil'

const prefix = 'components.common.toast.toast'
// 抽取硬编码数据
const message = defineMessages({
    nd_146840568541684y2ap: {
        id: `${prefix}.nd_146840568541684y2ap`,
        defaultMessage: '提示!',
        description:'nd_146840568541684y2ap'
    }
})

export default class Toast extends React.Component {
    static propTypes = {
        sticky: React.PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = {
            animateToggle:false,
            showToast:false,
            toastContent: IntlUtil.formatMessage(this, message.nd_146840568541684y2ap)
        }
    }

    makeText(text,duration = 2000) {
        let animateToggle = this.state.animateToggle
        if(this.currentTimeoutId) {
            clearTimeout(this.currentTimeoutId)
            animateToggle = !animateToggle
        }
        /*eslint-disable */
        this.setState({
            showToast:true,
            animateToggle:animateToggle,
            toastContent: text
        })
        /*eslint-enable */
        if(!duration) {
            return
        }
        try {
            this.refs.root.style.animationDuration = duration + 'ms'
        }catch (e) {
            console.log(e)
        }
        this.currentTimeoutId = setTimeout((()=> {
            this.currentTimeoutId = null
            /*eslint-disable */
            this.setState({
                showToast:false
            })
            /*eslint-enable */
            this.props.hideCallBack && this.props.hideCallBack()
        }).bind(this), duration)
    }

    dissmiss() {
        if(this.currentTimeoutId) {
            clearTimeout(this.currentTimeoutId)
        }
        /*eslint-disable */
        this.setState({
            showToast:false
        })
        /*eslint-enable */
    }

    render() {
        return (<div ref='root' className={`${styles['root']}`} style={{ display: this.state.showToast ? 'block' : 'none', zIndex: this.props.sticky ? 99999 : null }}>
            {this.state.toastContent}
        </div>)
    }

}
Toast.contextTypes = {
    intl: intlShape
}
