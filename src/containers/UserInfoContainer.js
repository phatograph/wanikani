import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import jump from 'jump.js'
import { browserHistory  } from 'react-router'

import {
  fetchUserInfo, fetchUserInfoSuccess,
  fetchRadical, fetchRadicalSuccess,
  fetchKanji, fetchKanjiSuccess,
  fetchVocab, fetchVocabSuccess,
  fetchEntities
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
  contextTypes: {
    router: React.PropTypes.object
  },
  componentDidMount() {
    // if (!localStorage.getItem('api_key')) {
    //   this.context.router.push('/login')
    // }
    //
    this.props.onLoad({ currentLevel: this.props.params.level })
  },
  onClick({ target }) {
    return (e) => {
      e.preventDefault()
      jump(target, { offset: -140, duration: 200 })
    }
  },
  render() {
    const userLevel = this.props.userInfo.get('level')

    return (
      <div>
        <div className={style.nav}>
          <div className={style.levels}>Levels</div>
          <div className={style.navLinks}>
            { Array.from('x'.repeat(userLevel)).map((x, i) => (
              <NavLink key={i} index={i + 1} onClick={this.props.onClick} userLevel={userLevel} />
            )) }
          </div>
          <div className={style.navScrolls}>
            <a href onClick={this.onClick({ target: '.handleRadicals' })}>Radicals</a>
            <a href onClick={this.onClick({ target: '.handleKanjis' })}>Kanjis</a>
            <a href onClick={this.onClick({ target: '.handleVocabularies' })}>Vocabularies</a>
          </div>
        </div>
        <div className={style.entityWrapper}>
          <Entities entities={this.props.radicals} wLink="radicals"   text="Radicals"     klassName={style.radical} currentLevel={this.props.params.level || userLevel} />
          <Entities entities={this.props.kanjis}   wLink="kanji"      text="Kanjis"       klassName={style.kanji}   currentLevel={this.props.params.level || userLevel} />
          <Entities entities={this.props.vocabs}   wLink="vocabulary" text="Vocabularies" klassName={style.vocab}   currentLevel={this.props.params.level || userLevel} />
        </div>
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
    userInfo: state.get('userInfoReducer'),
    radicals: state.get('radicalReducer'),
    kanjis: state.get('kanjiReducer'),
    vocabs: state.get('vocabReducer')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad:  ({ currentLevel }) => dispatch(fetchUserInfo({ currentLevel })),
    onClick: ({ currentLevel }) => dispatch(fetchEntities({ currentLevel }))
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
