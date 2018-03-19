import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createHashHistory'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../saga/rootSaga'

const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware, thunk),
  reduxReactRouter({ createHistory })
)(createStore)

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState)
    sagaMiddleware.run(rootSaga)
    return store
}
