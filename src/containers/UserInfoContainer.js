import React from 'react'
import { connect } from 'react-redux'
import fetchJsonp from 'fetch-jsonp'
import Immutable from 'immutable'
import { Link } from 'react-router'
import { fetchKanji, KanjiContainer } from './KanjiContainer'
import { fetchRadical, RadicalContainer } from './RadicalContainer'

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
        <RadicalContainer currentLevel={this.props.params.level || userLevel} />
        <KanjiContainer currentLevel={this.props.params.level || userLevel} />
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

const mapStateToProps = (state) => {
  return {
    userInfo: state.get('userInfoReducer')
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
