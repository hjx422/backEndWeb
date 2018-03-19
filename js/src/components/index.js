import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Loading from './common/loading/loading'
import { intlShape, defineMessages } from 'react-intl'

export default class Index extends Component {

    static childContextTypes = {
    }

    static contextTypes = {
        intl: intlShape
    }

    static propTypes = {
        message: ImmutablePropTypes.mapContains({
            type: React.PropTypes.string,
            content: React.PropTypes.string || ImmutablePropTypes.list
        }),
        isLoading: React.PropTypes.bool.isRequired,
        checkListLoading: React.PropTypes.bool.isRequired,
        children: React.PropTypes.node
    }

    getChildContext() {
        return {
        }
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div style={{ overflow: 'hidden' }}>
                <Loading isLoading={this.props.isLoading}/>
                {this.props.children}
            </div>

        )
    }
}

