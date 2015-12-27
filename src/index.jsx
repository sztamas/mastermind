import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {fromJS} from 'immutable'

import reducer from './reducer'
import App from './app'
import {newGame} from './actions'

const store = createStore(reducer)

store.dispatch(newGame())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
