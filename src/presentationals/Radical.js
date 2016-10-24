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

const Radical = ({ radical, klassName }) => (
  <div className={klassName}>
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

export const Radicals = ({ text, currentLevel, radicals, klassName }) => {
  const radicalsA = radicals.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div>
      <h2>{text} level {currentLevel}</h2>
      <div className={style.kanjiList}>
        { radicalsA.map((radical, i) => <Radical klassName={klassName} key={i} radical={radical} /> )}
      </div>
    </div>
  )
}
