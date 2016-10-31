import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import Immutable from 'immutable'
import { combineReducers } from 'redux-immutable'

import { UserInfoContainer } from './containers/UserInfoContainer'
import * as reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  combineReducers(reducers),
  Immutable.Map(),
  composeEnhancers(applyMiddleware(thunk))
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const NoMatch = ({ location }) => (
  <div>
    <h2>Whoops</h2>
    <p>Sorry but {location.pathname} didn’t match any pages</p>
  </div>
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={UserInfoContainer} />
      <Route path="/level/:level" component={UserInfoContainer} />
      <Route path="*" component={NoMatch}/>
    </Router>
  </Provider>,
  document.querySelector('#app')
)
