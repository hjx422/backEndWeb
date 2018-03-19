import styles from 'styles/components/common/dialog/dialog.css'
import React from 'react'
import { intlShape,defineMessages } from 'react-intl'
import IntlUtil from 'i18n/intlUtil'
import { bind } from '../../../utils/bindUtil'

const prefix = 'components.common.dialog.dialog'
// 抽取硬编码数据
const message = defineMessages({
    nd_14684031742447gpovw: {
        id: `${prefix}.nd_14684031742447gpovw`,
        defaultMessage: '提示信息',
        description:'nd_14684031742447gpovw'
    },
    nd_1468403174246dwndoh: {
        id: `${prefix}.nd_1468403174246dwndoh`,
        defaultMessage: '确认信息',
        description:'nd_1468403174246dwndoh'
    },
    nd_1468403174246qyy230: {
        id: `${prefix}.nd_1468403174246qyy230`,
        defaultMessage: '确定',
        description:'nd_1468403174246qyy230'
    },
    nd_1468403174247z91dvc: {
        id: `${prefix}.nd_1468403174247z91dvc`,
        defaultMessage: '取消',
        description:'nd_1468403174247z91dvc'
    },
    nd_1468403174249msjmsq: {
        id: `${prefix}.nd_1468403174249msjmsq`,
        defaultMessage: '关闭',
        description:'nd_1468403174249msjmsq'
    },
    nd_dialogShowNoMore: {
        id: `${prefix}.nd_dialogShowNoMore`,
        defaultMessage: '不再显示',
        description:'nd_dialogShowNoMore'
    },
    nd_notificationTitle: {
        id: `${prefix}.nd_notificationTitle`,
        defaultMessage: '系统通知',
        description:'nd_notificationTitle'
    }
})
/**
 * Created by Administrator on 2016/2/3.
 */

export default class GiftDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            DialogShow: false
        }
        this._DialogShow = bind(this.DialogShow, this)
        this._DialogClose = bind(this.DialogClose, this)
        this._handleConfirm = bind(this.handleConfirm, this)

    }

    DialogShow() {
        this.setState({
            DialogShow: true
        })
        if (this.props.justOpened) {
            this.props.justOpened()
        }
    }

    DialogClose() {
        this.setState({
            DialogShow: false
        })
        if (this.props.justClosed) {
            this.props.justClosed()
        }
    }

    handleConfirm(chooseType) {
        this.props.handleConfirm(chooseType)
    }

    getDialog() {
        let header,footer,children
        let msg = this.props.msg
        let chooseType = this.props.chooseType || ''
        if (this.props.children !== undefined) {
            header = this.props.title
            children = this.props.children
        }else {
            children =
                <div className={styles.content} style={this.props.contentStyle}>
                    {/*<img src='./static/img/info.png'  className={`${styles['fontMiddle']} ${styles['imgStyle']}`}/>*/}
                    <div className={styles.fontMiddle}>{msg}</div>
                </div>
            if(this.props.type == 'alert') {
                header = IntlUtil.formatMessage(this, message.nd_14684031742447gpovw)
                footer =
                    <div className={styles.footer}>
                        <div className={styles.confirmBtn} onClick={this._DialogClose}>{IntlUtil.formatMessage(this, message.nd_1468403174246qyy230)}</div>
                    </div>
            }else if(this.props.type == 'confirm') {
                header = IntlUtil.formatMessage(this, message.nd_1468403174246dwndoh)
                footer =
                    <div className={styles.footer}>
                        <div className={styles.confirmBtn} onClick={this._handleConfirm.bindArgs(chooseType)}>{IntlUtil.formatMessage(this, message.nd_1468403174246qyy230)}</div>
                        <div className={styles.cancelBtn} onClick={this._DialogClose}>{IntlUtil.formatMessage(this, message.nd_1468403174247z91dvc)}</div>
                    </div>
            } else if(this.props.type == 'sure') {
                footer =
                    <div className={styles.footer}>
                        <div className={styles.confirmBtn} onClick={this._handleConfirm.bindArgs(chooseType)}>{this.props.sureButtonMsg}</div>
                    </div>
            } else if (this.props.type == 'notification') {
                header = IntlUtil.formatMessage(this, message.nd_notificationTitle)
                footer =
                    <div className={styles.footer}>
                        <div className={styles.confirmBtn} onClick={this._handleConfirm.bindArgs(chooseType)}>{IntlUtil.formatMessage(this, message.nd_dialogShowNoMore)}</div>
                        <div className={styles.cancelBtn} onClick={this._DialogClose}>{IntlUtil.formatMessage(this, message.nd_1468403174249msjmsq)}</div>
                    </div>
            }
        }

        let actionStyle = {
            width: this.props.width,
            height: this.props.height,
            marginLeft: -parseInt(this.props.width)/2,
            marginTop: -parseInt(this.props.height)/2
        }

        //阴影部分
        //<div className={styles.container} onClick={this.DialogClose.bind(this)}>
        //</div>
        // <img src='./static/img/dialog-close.png' className={styles.closeBtn} title={IntlUtil.formatMessage(this, message.nd_1468403174249msjmsq)} onClick={this.DialogClose.bind(this)}/>
        return(
            <div>
                <div className={styles.mask} style={this.props.type == 'sure' ? {background: 'transparent', zIndex: '100'} : null}></div>
                <div className={styles.contentArea+' '+(this.state.DialogShow?styles.ani:'')} style={actionStyle}>
                    {
                        this.props.noTitle ? null : (
                            <div className={styles.header}>
                                {header}
                                <i className={styles.closeBtn} onClick={this._DialogClose}></i>
                            </div>
                        )
                    }
                    <div>
                        {children}
                    </div>
                    {footer}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.DialogShow?this.getDialog():''}
            </div>
        )
    }
}
GiftDialog.contextTypes = {
    intl: intlShape
}
GiftDialog.propTypes = {
    justOpened: React.PropTypes.func,
    justClosed: React.PropTypes.func,
    handleConfirm: React.PropTypes.func,
    msg: React.PropTypes.string,
    chooseType: React.PropTypes.string,
    children: React.PropTypes.element,
    contentStyle: React.PropTypes.object,
    type: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    noTitle: React.PropTypes.bool,
    title: React.PropTypes.string,
    sureButtonMsg: React.PropTypes.string
}
