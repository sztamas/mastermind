import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import createHistory from 'history/lib/createHashHistory'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {fromJS} from 'immutable'

import reducer from './reducer'
import {newGame} from './actions'
import AppRoutes from './app-routes'

const store = createStore(reducer)

store.dispatch(newGame())

const history = createHistory({queryKey: false})

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={history}
      onUpdate={() => window.scrollTo(0, 0)}>

      {AppRoutes}
    </Router>
  </Provider>,
  document.getElementById('app')
)

export {history}
