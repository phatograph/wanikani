import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import fetchJsonp from 'fetch-jsonp'

const App = React.createClass({
  render() {
    return (
      <div>
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

const Home = React.createClass({
  componentDidMount() {
    fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/level-progression?callback=callback')
    .then(response => response.json())
    .then(json => console.log(json))
  },
  render() {
    return (
      <div>
        <h2>Home</h2>
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
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/about" component={About}/>
    </Route>
  </Router>,
  document.querySelector('#app')
)
