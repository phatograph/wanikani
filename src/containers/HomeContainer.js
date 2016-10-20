import React from 'react'
import { connect } from 'react-redux'
import fetchJsonp from 'fetch-jsonp'

const Home = React.createClass({
  componentDidMount() {
    this.props.onLoad()
  },
  render() {
    return (
      <div>
        <h2>{this.props.kanjiList.name}</h2>
      </div>
    )
  }
})

const fetchUserInfo = (dispatch) => {
  return {
    type: 'FETCH_USER_INFO',
    dispatch
  }
}

const fetchUserInfoSuccess = (kanjiList) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    kanjiList
  }
}

export const kanjiList = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_USER_INFO':
      fetch('http://localhost:4001/')
      .then(response => response.json())
      .then(json => action.dispatch(fetchUserInfoSuccess(json)))
      return state
    case 'FETCH_USER_INFO_SUCCESS':
      return action.kanjiList
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    kanjiList: state.kanjiList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => dispatch(fetchUserInfo(dispatch))
  }
}

export const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
