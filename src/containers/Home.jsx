import React from 'react'
import fetchJsonp from 'fetch-jsonp'

const Home = React.createClass({
  componentDidMount() {
    this.props.onLoad()
  },
  render() {
    return (
      <div>
        <h2>{this.props.userInfo.name}</h2>
      </div>
    )
  }
})

export default Home
