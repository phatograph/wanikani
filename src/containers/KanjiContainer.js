import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import fetchJsonp from 'fetch-jsonp'

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

export const Kanjis = ({ currentLevel, kanjis }) => {
  const kanjisA = kanjis.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div>
      <h2>Kanjis</h2>
      <div className={style.kanjiList}>
        { kanjisA.map((kanji, i) => <Kanji key={i} kanji={kanji} /> )}
      </div>
    </div>
  )
}
