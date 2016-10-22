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

const NavLink = React.createClass({
  render() {
    const level = this.props.index + 1
    return (
      <Link to={`/level/${level}`}>{level}</Link>
    )
  }
})

const UserInfo = React.createClass({
  componentDidUpdate(prevProps, prevState) {
  },
  componentDidMount() {
    this.props.onLoad({ level: this.props.params.level })
  },
  render() {
    const level = this.props.userInfo.getIn(['user_information', 'level'])
    const kanjis = this.props.userInfo.get('requested_information', [])

    return (
      <div>
        <div className={style.nav}>
          { Array.from('x'.repeat(level)).map((x, i) => <NavLink key={i} index={i} level={this.props.params.level} /> )}
        </div>
        <div className={style.kanjiList}>
          { kanjis.map((kanji, i) => <Kanji key={i} kanji={kanji} /> )}
        </div>
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

const fetchKanji = ({ userInfo, dispatch }) => {
  return {
    type: 'FETCH_KANJI',
    userInfo,
    dispatch
  }
}

const fetchUserInfoSuccess = (userInfo) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    userInfo
  }
}

const fetchKanjiSuccess = (kanjis) => {
  kanjis.requested_information = kanjis.requested_information.sort((a, b) => {
    if (!a.user_specific) a.user_specific = { srs_numeric: 0 }
    if (!b.user_specific) b.user_specific = { srs_numeric: 0 }

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
      fetch('http://localhost:4000/state.json')
      .then(res => res.json())
      .then(kanji => action.dispatch(fetchKanjiSuccess(kanji.computedStates[2].state.userInfo)))

      // fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/user-information', { timeout: 10000 })
      //   .then(response => response.json())
      //   .then(userInfo => action.dispatch(fetchKanji({ userInfo, dispatch: action.dispatch })))
      return state
    case 'FETCH_KANJI':
      fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/2`, { timeout: 10000 })
        .then(response => response.json())
        .then(kanji => action.dispatch(fetchKanjiSuccess(kanji)))
      return state
    case 'FETCH_USER_INFO_SUCCESS':
      return Immutable.fromJS(action.userInfo)
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
      dispatch(fetchUserInfo(dispatch))
    }
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
