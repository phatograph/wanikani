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

const NavLink = ({ index, level, onClick }) => (
  <Link to={`/level/${index}`} onClick={ () => onClick({ level: index })}>{index}</Link>
)

const UserInfo = React.createClass({
  componentDidMount() {
    this.props.onLoad({ level: this.props.params.level })
  },
  render() {
    const level = this.props.userInfo.getIn(['user_information', 'level'])
    const kanjis = this.props.userInfo.get('requested_information', [])

    return (
      <div>
        <div className={style.nav}>
          { Array.from('x'.repeat(level)).map((x, i) => <NavLink key={i} index={i + 1} onClick={this.props.onLoad} level={this.props.params.level} /> )}
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

const fetchKanji = ({ level, userInfo, dispatch }) => {
  return {
    type: 'FETCH_KANJI',
    level,
    userInfo,
    dispatch
  }
}

const fetchKanjiSuccess = (kanjis) => {
  kanjis.requested_information = kanjis.requested_information.sort((a, b) => {
    const defaultSrs = { srs_numeric: 0, srs: 'novice'  }
    if (!a.user_specific) a.user_specific = defaultSrs
    if (!b.user_specific) b.user_specific = defaultSrs

    return a.user_specific.srs_numeric - b.user_specific.srs_numeric
  })

  return {
    type: 'FETCH_KANJI_SUCCESS',
    kanjis
  }
}

export const userInfo = (state = Immutable.Map(), action) => {
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
        .then(userInfo => action.dispatch(fetchKanji({
          level: action.level,
          userInfo,
          dispatch: action.dispatch
        })))
      return state
    case 'FETCH_KANJI':
      const level = action.level || action.userInfo.user_information.level
      fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/${level}`, { timeout: 10000 })
        .then(response => response.json())
        .then(kanji => action.dispatch(fetchKanjiSuccess(kanji)))
      return state
    case 'FETCH_KANJI_SUCCESS':
      return Immutable.fromJS(action.kanjis)
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.get('userInfo')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: ({ level }) => {
      dispatch(fetchUserInfo({ level, dispatch }))
    }
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
