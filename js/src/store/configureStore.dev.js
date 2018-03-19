import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import DevTools from '../containers/devTools'
//import createHistory from 'history/lib/createBrowserHistory';
import createHistory from 'history/lib/createHashHistory'
//import { createHistory } from 'history';
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../saga/rootSaga'
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware, thunk),
  reduxReactRouter({ createHistory }),
  // applyMiddleware(createLogger()),
  DevTools.instrument()
)(createStore)

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState)
    sagaMiddleware.run(rootSaga)

    if (module.hot) {
    // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers')
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}
