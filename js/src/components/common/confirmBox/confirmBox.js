/**
 * Created by cpoopc on 2016/6/25.
 */
import React from 'react'
import styles from './confirmBox.css'
import { intlShape,defineMessages } from 'react-intl'
import IntlUtil from 'i18n/intlUtil'
const prefix = 'common.ConfirmBox'
// 抽取硬编码数据
const messages = defineMessages({
    confirm: {
        id: `${prefix}.confirm`,
        defaultMessage: '确定',
        description:'confirm'
    },
    cancel: {
        id: `${prefix}.cancel`,
        defaultMessage: '取消',
        description:'cancel'
    }
})

export default class ConfirmBox extends React.Component {

    constructor(props) {
        super(props)
    }

    onConfirm() {
        this.props.onConfirm && this.props.onConfirm()
    }

    onCancelConfirm() {
        this.props.onCancelConfirm && this.props.onCancelConfirm()
    }

    render() {
        let hideStyle = this.props.show?'':styles['hide']
        return (
            <div className={`${styles['mask']} ${hideStyle}`}>
                <div className={`${styles['dialog-comfirm-box']} ${this.props.show?styles['ani']:''}`}>
                    <div className={styles['comfirm-content']}>
                        {this.props.comfirmTips}
                    </div>
                    <div className={styles['btn-box']}>
                        <div className={styles['btn-confirm']} onClick={this.onConfirm.bind(this)}>{IntlUtil.formatMessage(this, messages.confirm)}</div>
                        <div className={styles['btn-cancel']} onClick={this.onCancelConfirm.bind(this)}>{IntlUtil.formatMessage(this, messages.cancel)}</div>
                    </div>
                </div>
            </div>
        )
    }
}

ConfirmBox.contextTypes = {
    intl: intlShape
}
