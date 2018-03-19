/**
 * Created by cpoopc on 2016/7/12.
 */
import React, { Component, PropTypes } from 'react'
import { addLocaleData, IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import enLocaleData from 'react-intl/locale-data/en'
import zhLocaleData from 'react-intl/locale-data/zh'
// 翻译，仅为了网站标题s
import IntlUtil from 'i18n/intlUtil'
import { intlShape,defineMessages } from 'react-intl'

addLocaleData(enLocaleData)
addLocaleData(zhLocaleData)
addLocaleData({
    locale: 'zh-CN',
    parentLocale: 'zh'
})

export const supportLangs = ['zh','en']

export const messages = {
    ['zh']: require('./zh.json'),
    ['en']: require('./en.json')
}

const prefix = 'intl'
// 抽取硬编码数据
const message = defineMessages({
    webTitle: {
        id: `${prefix}.webTitle`,
        defaultMessage: 'DJ 名片',
        description: 'DJ 名片'
    }
})

class Intl extends Component {
    static propTypes = {
        language: PropTypes.string.isRequired,
        locale: PropTypes.string,
        children: PropTypes.element.isRequired
    }

    constructor(props) {
        super(props)
        let areIntlLocalesSupported = require('intl-locales-supported')
        let localesMyAppSupports = [
            'en','zh'
        ]
        if (global.Intl) {
            // Determine if the built-in `Intl` has the locale data we need.
            if (!areIntlLocalesSupported(localesMyAppSupports)) {
                // `Intl` exists, but it doesn't have the data we need, so load the
                // polyfill and patch the constructors we need with the polyfill's.
                let IntlPolyfill    = require('intl')
                Intl.NumberFormat   = IntlPolyfill.NumberFormat
                Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
            }
        } else {
            // No `Intl`, so use and load the polyfill.
            global.Intl = require('intl')
        }
    }

    componentDidMount() {
    }

    render() {
        let locale
        // console.log('intl component ')
        // console.log(this.props.language)

        if (this.props.language) {
            locale = this.props.language
        // } else if(localStorage.lang){
        //    locale = localStorage.lang
        } else {
            let languages = window.navigator.languages ||
                [ window.navigator.language ||
                window.navigator.userLanguage ||
                'zh-CN' ]
            locale = this.props.locale || languages[0]
        }

        if (locale.startsWith('zh')) {
            locale = 'zh'
        }else {
            locale =  'en'
        } // 要么中文要么其他
        // locale = 'en'

        // 设置网站标题
        let webTitle = message.webTitle
        top.document.title = messages[locale][webTitle.id] || webTitle.defaultMessage

        return <IntlProvider locale={locale} messages={messages[locale]}>
            {this.props.children}
        </IntlProvider>
    }
}

function mapStateToProps(state) {
    return {
        language : state.global.curLang
    }
}

function mapDispatchToProps(state) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Intl)
