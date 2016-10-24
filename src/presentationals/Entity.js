import React from 'react'
import Immutable from 'immutable'

import style from './../../assets/css/style.css'

const Char = ({ entity }) => {
  if (entity.get('character')) {
    return (<div>{entity.get('character')}</div>)
  }

  return (
    <div className={style.characterImgWrapper}><img className={style.characterImg} src={entity.get('image')} /></div>
  )
}

const Entity = ({ entity, klassName }) => (
  <div className={klassName}>
    <div className={style.wrapper}>
      <div className={style.character}><Char entity={ entity } /></div>
      <div>
        Lvl&nbsp;
        { entity.getIn(['user_specific', 'srs_numeric']) }
        &nbsp;
        { entity.getIn(['user_specific', 'srs']) }
      </div>
    </div>
  </div>
)

export const Entities = ({ text, currentLevel, entities, klassName }) => {
  const entitiesA = entities.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div>
      <h2>{text} level {currentLevel}</h2>
      <div className={style.kanjiList}>
        { entitiesA.map((entity, i) => <Entity klassName={klassName} key={i} entity={entity} /> )}
      </div>
    </div>
  )
}
