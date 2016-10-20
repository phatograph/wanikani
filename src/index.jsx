import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { userInfo, UserInfoContainer } from './containers/UserInfoContainer.js'
import { kanjiList, HomeContainer } from './containers/HomeContainer.js'

const store = createStore(combineReducers({
  userInfo,
  kanjiList
}))

const App = React.createClass({
  render() {
    return (
      <div>
        <UserInfoContainer />
        <h1>React Router Tutorial</h1>
        <ul role="nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
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
        <IndexRoute component={HomeContainer}/>
        <Route path="/about" component={About}/>
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#app')
)
