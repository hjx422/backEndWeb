import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'
import Intl from './i18n/intl'
import getRoutes from './routes'

export default class Root extends Component {
    render() {
        const { store } = this.props
        return (
            <Provider store={store}>
                <Intl>
                    <ReduxRouter>
                        { getRoutes(store) }
                    </ReduxRouter>
                </Intl>
            </Provider>
        )
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
}
