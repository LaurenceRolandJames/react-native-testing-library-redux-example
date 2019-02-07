import React from 'react'
import { render } from 'react-native-testing-library'
import { IntlProvider } from 'react-intl'
import { Text } from 'react-native'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'redux/rootSaga'
import { combinedReducers } from 'redux/reducers'

const appReducer = combineReducers(combinedReducers)

const rootReducer = (state, action) => {
  // This action is used to clear the redux store after every test.
  if (action.type === 'RESET') {
    const clearedState = {}
    return appReducer(clearedState, action)
  }
  return appReducer(state, action)
}

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

const configureStore = () => {
  const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middleware)),
  )

  sagaMiddleware.run(rootSaga)

  return { store }
}

const { store } = configureStore()

const customRender = (ui, options = {}) =>
  render(
    <Provider store={store}>
      <IntlProvider locale="en" textComponent={Text}>
        {ui}
      </IntlProvider>
    </Provider>,
    options,
  )

export * from 'react-native-testing-library'

export { customRender, store }
