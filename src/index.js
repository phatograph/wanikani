import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Immutable from 'immutable'
import { combineReducers } from 'redux-immutable'

import { UserInfoContainer } from './containers/UserInfoContainer'
import { userInfoReducer, radicalReducer, kanjiReducer }  from './reducers'

const store = createStore(combineReducers({
    userInfoReducer,
    kanjiReducer,
    radicalReducer
  }),
  Immutable.Map(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

// TODO: Implement this
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
    </Router>
  </Provider>,
  document.querySelector('#app')
)
