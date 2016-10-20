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

const fetchKanjiList = (dispatch) => {
  return {
    type: 'FETCH_KANJI_LIST',
    dispatch
  }
}

const fetchKanjiListSuccess = (kanjiList) => {
  return {
    type: 'FETCH_KANJI_LIST_SUCCESS',
    kanjiList
  }
}

export const kanjiList = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_KANJI_LIST':
      fetch('http://localhost:4001/')
      .then(response => response.json())
      .then(json => action.dispatch(fetchKanjiListSuccess(json)))
      return state
    case 'FETCH_KANJI_LIST_SUCCESS':
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
    onLoad: () => dispatch(fetchKanjiList(dispatch))
  }
}

export const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
