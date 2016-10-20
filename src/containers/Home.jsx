import React from 'react'
import fetchJsonp from 'fetch-jsonp'

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

export default Home
