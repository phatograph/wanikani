import React from 'react'
import { connect } from 'react-redux'
import fetchJsonp from 'fetch-jsonp'
import Immutable from 'immutable'

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

const UserInfo = React.createClass({
  componentDidMount() {
    this.props.onLoad()
  },
  render() {
    const kanjis = this.props.userInfo.get('requested_information', [])

    return (
      <div className={style.kanjiList}>
        { kanjis.map((kanji, i) => <Kanji key={i} kanji={kanji} /> )}
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

const fetchUserInfoSuccess = (userInfo) => {
  userInfo.requested_information = userInfo.requested_information.sort((a, b) => {
    if (!a.user_specific) a.user_specific = { srs_numeric: 0 }
    if (!b.user_specific) b.user_specific = { srs_numeric: 0 }

    return a.user_specific.srs_numeric - b.user_specific.srs_numeric
  })

  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    userInfo
  }
}

export const userInfo = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_USER_INFO':
      // fetch('http://localhost:4000/state.json')
      // .then(res => res.json())
      // .then(kanji => {
      //   action.dispatch(fetchUserInfoSuccess(kanji.computedStates[2].state.userInfo))
      // })

      fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/user-information')
        .then(response => response.json())
        .then(userInfo => {
          fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/2`)
            .then(response => response.json())
            .then(kanji => action.dispatch(fetchUserInfoSuccess(kanji)))
      })
      return state
    case 'FETCH_USER_INFO_SUCCESS':
      return Immutable.fromJS(action.userInfo)
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
    onLoad: () => dispatch(fetchUserInfo(dispatch))
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
