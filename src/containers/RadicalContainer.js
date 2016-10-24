import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import fetchJsonp from 'fetch-jsonp'

import style from './../../assets/css/style.css'

const Char = ({ radical }) => {
  if (radical.get('character')) {
    return (<div>{radical.get('character')}</div>)
  }

  return (
    <div className={style.characterImgWrapper}><img className={style.characterImg} src={radical.get('image')} /></div>
  )
}

const Radical = ({ radical }) => (
  <div className={style.radical}>
    <div className={style.wrapper}>
      <div className={style.character}><Char radical={ radical } /></div>
      <div>
        Lvl&nbsp;
        { radical.getIn(['user_specific', 'srs_numeric']) }
        &nbsp;
        { radical.getIn(['user_specific', 'srs']) }
      </div>
    </div>
  </div>
)

const Radicals = ({ currentLevel, radicals }) => {
  const radicalsA = radicals.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div>
      <h2>Radicals</h2>
      <div className={style.kanjiList}>
        { radicalsA.map((radical, i) => <Radical key={i} radical={radical} /> )}
      </div>
    </div>
  )
}

export const fetchRadical = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_RADICAL',
    currentLevel,
    dispatch
  }
}

const fetchRadicalSuccess = ({ radicals, currentLevel }) => {
  return {
    type: 'FETCH_RADICAL_SUCCESS',
    radicals,
    currentLevel
  }
}

export const radicalReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_RADICAL':
      if (!state.get(`level${action.currentLevel}`)) {
        fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/radicals/${action.currentLevel}`, { timeout: 10000 })
          .then(response => response.json())
          .then(radicals => action.dispatch(fetchRadicalSuccess({ radicals, currentLevel: action.currentLevel })))
      }
      else {
        setTimeout(() => {
          action.dispatch({ type: 'FETCH_RADICAL_CACHE' })
        }, 10)
      }

      return state
    case 'FETCH_RADICAL_SUCCESS':
      action.radicals.requested_information = action.radicals.requested_information.sort((a, b) => {
        const defaultSrs = { srs_numeric: 0, srs: 'novice' }
        if (!a.user_specific) a.user_specific = defaultSrs
        if (!b.user_specific) b.user_specific = defaultSrs

        return a.user_specific.srs_numeric - b.user_specific.srs_numeric
      })

      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.radicals.requested_information))
    case 'FETCH_RADICAL_CACHE':
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    radicals: state.get('radicalReducer')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export const RadicalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Radicals)
