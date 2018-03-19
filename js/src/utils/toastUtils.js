/**
 * Created by suncg on 2017/3/31.
 */
import IntlUtil from 'i18n/intlUtil'
import {intlShape, defineMessages} from 'react-intl'
import {
    TAGS_PLAN,
    TAGS_PREPARED,
    TAGS_DISCUSS,
    TAGS_PENDING,
    TAGS_COMPLETED,
    TAG_PLAN_HISTORY
} from '../constants/constants'

const prefix = 'utils.toast'
// 抽取硬编码数据
const message = defineMessages({
    listEmptyTip: {
        id: `${prefix}.listEmptyTip`,
        defaultMessage: '宝宝找不到你要的议题，宝宝好伤心！',
        description: 'listEmptyTip'
    },
    title: {
        id: `${prefix}.title`,
        defaultMessage: '标题',
        description: 'title'
    },
    code: {
        id: `${prefix}.code`,
        defaultMessage: '议题编号',
        description: 'code'
    },
    founder: {
        id: `${prefix}.founder`,
        defaultMessage: '提出人',
        description: 'founder'
    },
    search: {
        id: `${prefix}.search`,
        defaultMessage: '搜索',
        description: 'search'
    },
    conditionEmptyTip: {
        id: `${prefix}.conditionEmptyTip`,
        defaultMessage: '搜索条件不能为空',
        description: 'conditionEmptyTip'
    },
    success: {
        id: `${prefix}.success`,
        defaultMessage: '该议题已经成功转入"',
        description: 'success'
    },
    successModify: {
        id: `${prefix}.successModify`,
        defaultMessage: '该议题已经成功更改"',
        description: 'successModify'
    },
    prepared: {
        id: `${prefix}.prepared`,
        defaultMessage: '议题准备"',
        description: 'prepared'
    },
    discuss: {
        id: `${prefix}.discuss`,
        defaultMessage: '议题讨论"',
        description: 'discuss'
    },
    pending: {
        id: `${prefix}.pending`,
        defaultMessage: '议题待处理"',
        description: 'pending'
    },
    completed: {
        id: `${prefix}.completed`,
        defaultMessage: '已完成"',
        description: 'completed'
    },
    plan: {
        id: `${prefix}.plan`,
        defaultMessage: '待讨论议题计划"',
        description: 'plan'
    },
    tagPlan: {
        id: `${prefix}.tagPlan`,
        defaultMessage: '议题计划"',
        description: 'tagPlan'
    }
})

export default {
    operateToast(tag, originalHasTagPlan) {
        let text = ''
        switch (tag) {
        case TAGS_PREPARED:
            text = `${IntlUtil.formatMessage(this, message.success) + '' + IntlUtil.formatMessage(this, message.prepared)}`
            break
        case TAGS_DISCUSS:
            text = `${IntlUtil.formatMessage(this, message.success) + '' + IntlUtil.formatMessage(this, message.discuss)}`
            break
        case TAGS_PENDING:
            text = `${IntlUtil.formatMessage(this, message.success) + '' + IntlUtil.formatMessage(this, message.pending)}`
            break
        case TAGS_COMPLETED:
            text = `${IntlUtil.formatMessage(this, message.success) + '' + IntlUtil.formatMessage(this, message.completed)}`
            break
        case TAGS_PLAN: {
            if (originalHasTagPlan) {
                text = `${IntlUtil.formatMessage(this, message.successModify) + '' + IntlUtil.formatMessage(this, message.tagPlan)}`
            } else {
                text = `${IntlUtil.formatMessage(this, message.success) + '' + IntlUtil.formatMessage(this, message.plan)}`
            }
            break
        }
        }
        return text
    }
}
