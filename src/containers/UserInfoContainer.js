import React from 'react'
import { connect } from 'react-redux'
import fetchJsonp from 'fetch-jsonp'
import Immutable from 'immutable'
import { Link } from 'react-router'
import { Radicals } from './../presentationals/Radical'

import style from './../../assets/css/style.css'

const NavLink = ({ index, userLevel, onClick }) => (
  <Link
    to={index == userLevel ? '/' : `/level/${index}`}
    onClick={() => onClick({ currentLevel: index })}
    className={style.navLink}
    activeClassName={style.navLinkActive}
    onlyActiveOnIndex={true}
  >
    {index}
  </Link>
)

const UserInfo = React.createClass({
  componentDidMount() {
    this.props.onLoad({ currentLevel: this.props.params.level })
  },
  render() {
    const userLevel = this.props.userInfo.get('level')

    return (
      <div>
        <div className={style.nav}>
          { Array.from('x'.repeat(userLevel)).map((x, i) => (
            <NavLink key={i} index={i + 1} onClick={this.props.onClick} userLevel={userLevel} />
          )) }
        </div>
        <Radicals radicals={this.props.radicals} text="Radicals" klassName={style.radical} currentLevel={this.props.params.level || userLevel} />
        <Radicals radicals={this.props.kanjis}   text="Kanjis"   klassName={style.kanji}   currentLevel={this.props.params.level || userLevel} />
      </div>
    )
  }
})

const fetchUserInfo = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_USER_INFO',
    currentLevel,
    dispatch
  }
}

const fetchUserInfoSuccess = ({ currentLevel, userInfo, dispatch }) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    currentLevel,
    userInfo,
    dispatch
  }
}

const fetchRadical = ({ currentLevel, dispatch }) => {
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

export const userInfoReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_USER_INFO':
      fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/user-information', { timeout: 10000 })
        .then(response => response.json())
        .then(userInfo => {
          action.dispatch(fetchUserInfoSuccess({
            currentLevel: action.currentLevel || userInfo.user_information.level,
            userInfo,
            dispatch: action.dispatch
          }))
        })

      return state
    case 'FETCH_USER_INFO_SUCCESS':
      // Need async, or else: `Reducers may not dispatch action`.
      setTimeout(() => {
        action.dispatch(fetchKanji({
          currentLevel: action.currentLevel,
          dispatch: action.dispatch
        }))

        action.dispatch(fetchRadical({
          currentLevel: action.currentLevel,
          dispatch: action.dispatch
        }))
      }, 10)

      return Immutable.fromJS(action.userInfo.user_information)
    default:
      return state
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
    userInfo: state.get('userInfoReducer'),
    radicals: state.get('radicalReducer'),
    kanjis: state.get('kanjiReducer')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad:  ({ currentLevel }) => dispatch(fetchUserInfo({ currentLevel, dispatch })),
    onClick: ({ currentLevel }) => {
      dispatch(fetchKanji({ currentLevel, dispatch }))
      dispatch(fetchRadical({ currentLevel, dispatch }))
    }
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
