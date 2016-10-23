import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Immutable from 'immutable'
import { combineReducers } from 'redux-immutable'

import { userInfoReducer, kanjisReducer, UserInfoContainer } from './containers/UserInfoContainer'
// import { kanjiList, HomeContainer } from './containers/HomeContainer'

const store = createStore(combineReducers({
  userInfoReducer,
  kanjisReducer
}),
Immutable.Map(),
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const App = React.createClass({
  render() {
    return (
      <div>
        {/* <h1>React Router Tutorial</h1> */}
        {/* <ul role="nav"> */}
        {/*   <li><Link to="/">Home</Link></li> */}
        {/*   <li><Link to="/about">About</Link></li> */}
        {/* </ul> */}
        {this.props.children}
      </div>
    )
  }
})

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
      <Route path="/" component={App}>
        <IndexRoute component={UserInfoContainer}/>
        <Route path="/about" component={About}/>
        <Route path="/level/:level" component={UserInfoContainer}/>
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#app')
)
