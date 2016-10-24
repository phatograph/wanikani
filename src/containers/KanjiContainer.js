import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import fetchJsonp from 'fetch-jsonp'

import style from './../../assets/css/style.css'

const Kanji = ({ kanji }) => (
  <div className={style.kanji}>
    <div className={style.wrapper}>
      <div className={style.character}>{ kanji.get('character') }</div>
      <div>
        Lvl&nbsp;
        { kanji.getIn(['user_specific', 'srs_numeric']) }
        &nbsp;
        { kanji.getIn(['user_specific', 'srs']) }
      </div>
    </div>
  </div>
)

const Kanjis = React.createClass({
  render() {
    const currentLevel = this.props.params.level
    const kanjis = this.props.kanjis.get(`level${currentLevel}`, Immutable.List()).toArray()

    return (
      <div className={style.kanjiList}>
        { kanjis.map((kanji, i) => <Kanji key={i} kanji={kanji} /> )}
      </div>
    )
  }
})

export const fetchKanji = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_KANJI',
    currentLevel,
    dispatch
  }
}

const fetchKanjiSuccess = ({ kanjis, currentLevel }) => {
  return {
    type: 'FETCH_KANJI_SUCCESS',
    kanjis,
    currentLevel
  }
}

export const kanjiReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_KANJI':
      if (!state.get(`level${action.currentLevel}`)) {
        fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/${action.currentLevel}`, { timeout: 10000 })
          .then(response => response.json())
          .then(kanjis => action.dispatch(fetchKanjiSuccess({ kanjis, currentLevel: action.currentLevel })))
      }
      else {
        setTimeout(() => {
          action.dispatch({ type: 'FETCH_KANJI_CACHE' })
        }, 10)
      }

      return state
    case 'FETCH_KANJI_SUCCESS':
      action.kanjis.requested_information = action.kanjis.requested_information.sort((a, b) => {
        const defaultSrs = { srs_numeric: 0, srs: 'novice' }
        if (!a.user_specific) a.user_specific = defaultSrs
        if (!b.user_specific) b.user_specific = defaultSrs

        return a.user_specific.srs_numeric - b.user_specific.srs_numeric
      })

      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.kanjis.requested_information))
    case 'FETCH_KANJI_CACHE':
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    kanjis: state.get('kanjiReducer')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export const KanjiContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanjis)
