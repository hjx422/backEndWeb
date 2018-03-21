import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'
import DevTools from './containers/devTools'
import Intl from './i18n/intl'
import getRoutes from './routes'

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
            <Provider store={store}>
                <Intl>
                    <div>
                        <ReduxRouter>
                            { getRoutes(store) }{/*https://github.com/acdlite/redux-router/pull/62*/}
                        </ReduxRouter>
                        <DevTools />
                    </div>
                </Intl>
            </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
