/**
 * Created by cpoopc on 2016/7/13.
 */
import React  from 'react'
import IntlUtil from '../../../i18n/intlUtil'
import { bind } from '../../../utils/bindUtil'
import Popover from '../popover/popover'
import styles from 'styles/components/common/languegeSwitch/languageSwitchStyle.css'
import { intlShape,defineMessages } from 'react-intl'
const prefix = 'common.languaueSwitch'
// 抽取硬编码数据
const messages = defineMessages({
    currentLanguage: {
        id: `${prefix}.currentLanguage`,
        defaultMessage: '中文',
        description:'currentLanguage'
    },
    switchLanguage: {
        id: `${prefix}.switchLanguage`,
        defaultMessage: '(切换)',
        description:'switchLanguage'
    }
})
export default class LanguagesSwitch extends React.Component {

    constructor(props) {
        super(props)
        this.state={
        }
        this._popover = bind(this.popover, this)
        this._switchLanguage = bind(this.switchLanguage, this)
    }

    popover(key, isShow) {
        this.props.handlePopover(key, isShow)
    }

    switchLanguage(lang, e) {
        e.preventDefault()
        e.stopPropagation()
        this.props.setLang(lang)
        this.popover(false)
    }

    render() {
        let content = this.props.supportLangs.map((language, index)=>{
            return <li key={`language-${index}`} onClick={this._switchLanguage.bindArgs(language.get('lang'))}>
                {language.get('displayName')}
            </li>
        })
        let popContent = <ul>{content}</ul>
        return (<div className={styles.languageBox} onMouseLeave={this._popover.bindArgs(this.props.name, false)}>
            <span onMouseEnter={this._popover.bindArgs(this.props.name, true)}
                  onClick={this._popover.bindArgs(this.props.name, true)}>
                {this.props.currentLang == 'zh' ? '中文' : 'English'}
            </span>
            <Popover ref='shiftPop'
                     width='150'
                     direction='down'
                     style={{ top: '40px' }}
                     content={popContent}
                     show={this.props.show}
            />
        </div>)
    }

}

LanguagesSwitch.displayName = 'LanguagesSwitch'

LanguagesSwitch.propTypes = {
    name: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool.isRequired,
    handlePopover: React.PropTypes.func.isRequired,
    supportLangs: React.PropTypes.array.isRequired,
    currentLang: React.PropTypes.string.isRequired,
    setLang: React.PropTypes.func.isRequired
}

LanguagesSwitch.contextTypes = {
    intl: intlShape
}

