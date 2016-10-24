import React from 'react'
import { connect } from 'react-redux'
import fetchJsonp from 'fetch-jsonp'
import Immutable from 'immutable'
import { Link } from 'react-router'

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

const NavLink = ({ index, level, userInfo, onClick }) => (
  <Link to={`/level/${index}`} onClick={ () => onClick({ level: index, userInfo })}>{index}</Link>
)

const UserInfo = React.createClass({
  componentDidMount() {
    this.props.onLoad({ level: this.props.params.level })
  },
  render() {
    const userLevel    = this.props.userInfo.get('level')
    const currentLevel = this.props.params.level
    const kanjis       = this.props.kanjis.get(`level${currentLevel || userLevel}`, Immutable.List()).toArray()

    return (
      <div>
        <div className={style.nav}>
          { Array.from('x'.repeat(userLevel)).map((x, i) => (
            <NavLink key={i} index={i + 1} onClick={this.props.onClick} userInfo={this.props.userInfo} level={currentLevel} />
          )) }
        </div>
        <div className={style.kanjiList}>
          { kanjis.map((kanji, i) => <Kanji key={i} kanji={kanji} /> )}
        </div>
      </div>
    )
  }
})

const fetchUserInfo = ({ level, dispatch }) => {
  return {
    type: 'FETCH_USER_INFO',
    level,
    dispatch
  }
}

const fetchUserInfoSuccess = ({ level, userInfo, dispatch }) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    level,
    userInfo,
    dispatch
  }
}

const fetchKanji = ({ level, userInfo, dispatch }) => {
  return {
    type: 'FETCH_KANJI',
    level,
    userInfo,
    dispatch
  }
}

const fetchKanjiSuccess = ({ kanjis, level }) => {
  return {
    type: 'FETCH_KANJI_SUCCESS',
    kanjis,
    level
  }
}

export const userInfoReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_USER_INFO':
      // fetch('http://localhost:4000/state.json')
      //   .then(res => res.json())
      //   .then(userInfo => action.dispatch(fetchKanji({
      //     level: action.level,
      //     userInfo: userInfo.computedStates[2].state.userInfo,
      //     dispatch: action.dispatch
      //   })))

      fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/user-information', { timeout: 10000 })
        .then(response => response.json())
        .then(userInfo => action.dispatch(fetchUserInfoSuccess({
          level: action.level,
          userInfo,
          dispatch: action.dispatch
        })))

      return state
    case 'FETCH_USER_INFO_SUCCESS':
      // Need async, or else: `Reducers may not dispatch action`.
      setTimeout(() => {
        action.dispatch(fetchKanji({
          level: action.level,
          userInfo: action.userInfo,
          dispatch: action.dispatch
        }))
      }, 10)

      return Immutable.fromJS(action.userInfo.user_information)
    default:
      return state
  }
}

export const kanjisReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_KANJI':
      // In case of accessing from root domain.
      const level = action.level || action.userInfo.user_information.level

      if (!state.get(`level${action.level}`)) {
        fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/${level}`, { timeout: 10000 })
          .then(response => response.json())
          .then(kanjis => action.dispatch(fetchKanjiSuccess({ kanjis, level })))
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

      return state.set(`level${action.level}`, Immutable.fromJS(action.kanjis.requested_information))
    case 'FETCH_KANJI_CACHE':
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.get('userInfoReducer'),
    kanjis: state.get('kanjisReducer')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: ({ level }) => dispatch(fetchUserInfo({ level, dispatch })),
    onClick: ({ level, userInfo }) => {
      // Assume that `userInfo` is already present.
      return dispatch(fetchKanji({
        level,
        userInfo,
        dispatch
      }))
    }
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
