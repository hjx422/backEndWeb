/**
 * Created by cpoopc on 2016/7/11.
 */
import {messages} from './intl'

let mokeIntl = {
    formatDate(value, options = {}) {
        return value
    },
    formatTime(value, options = {}) {
        return value
    },
    formatHTMLMessage(messageDescriptor, rawValues = {}) {
        return messageDescriptor
    },
    formatMessage(messageDescriptor = {}, values = {}) {
        // console.log(this)
        return messageDescriptor.defaultMessage
    },
    formatNumber(value, options = {}) {
        return value
    },
    formatPlural(value, options = {}) {
        return value
    },
    formatRelative(value, options = {}) {
        return value
    }
}

export default {
    getIntl(context) {
        // component
        if(!context) {
            if(window.reactIntl) {
                return window.reactIntl
            }else {
                return mokeIntl
            }
        }
        if(context.context && context.context.intl) {
            if(context.context.intl && window.reactIntl != context.context.intl) {
                window.reactIntl = context.context.intl
            }
            return context.context.intl
        }else {
            if(window.reactIntl) {
                return window.reactIntl
            }else {
                return mokeIntl
            }
        }
    },
    formatDate(context, value, options = {}) {
        return this.getIntl(context).formatDate(value, options)
    },
    formatTime(context, value, options = {}) {
        return this.getIntl(context).formatTime(value, options)
    },
    formatHTMLMessage(context, messageDescriptor, rawValues = {}) {
        return this.getIntl(context).formatHTMLMessage(messageDescriptor.id ? messageDescriptor : {id: messageDescriptor}, rawValues)
    },
    formatMessage(context, messageDescriptor = {}, values = {}) {
        return this.getIntl(context).formatMessage(messageDescriptor.id ? messageDescriptor : {id: messageDescriptor}, values)
    },
    formatNumber(context, value, options = {}) {
        return this.getIntl(context).formatNumber(value, options)
    },
    formatPlural(context, value, options = {}) {
        return this.getIntl(context).formatPlural(value, options)
    },
    formatRelative(context, value, options = {}) {
        return this.getIntl(context).formatRelative(value, options)
    },
    formatMessageByLang(lang, value) {
        let langMessages = messages[lang]
        if(langMessages) {
            if(value.id) {
                return langMessages[value.id]
            }
            return langMessages[value]
        }
        return value
    }
}

