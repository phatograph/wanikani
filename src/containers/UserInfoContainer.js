import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  fetchUserInfo, fetchUserInfoSuccess, fetchRadical, fetchRadicalSuccess,
  fetchKanji, fetchKanjiSuccess
} from './../actions'

import { Entities } from './../presentationals/Entity'

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
        <Entities entities={this.props.radicals} text="Radicals" klassName={style.radical} currentLevel={this.props.params.level || userLevel} />
        <Entities entities={this.props.kanjis}   text="Kanjis"   klassName={style.kanji}   currentLevel={this.props.params.level || userLevel} />
      </div>
    )
  }
})

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
