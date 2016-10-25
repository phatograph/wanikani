import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { toggleEntity } from './../actions'

import style from './../../assets/css/style.css'

const Char = ({ entity }) => {
  if (entity.get('character')) {
    return (<div>{entity.get('character')}</div>)
  }

  return (
    <div className={style.characterImgWrapper}><img className={style.characterImg} src={entity.get('image')} /></div>
  )
}

const Entity = ({ text, klassName, entity, currentLevel, onClick }) => (
  <a href className={entity.get('uiActive') ? `${klassName} ${style.entityActive}` : klassName} onClick={(e) => { e.preventDefault(); onClick({ entity: entity.get('character'), currentLevel, text }) }}>
    <div className={style.wrapper}>
      <div className={style.character}><Char entity={ entity } /></div>
      <div className={style.srsLevel}>
        Lvl&nbsp;
        { entity.getIn(['user_specific', 'srs_numeric']) }
        &nbsp;
        { entity.getIn(['user_specific', 'srs']) }
      </div>
    </div>
  </a>
)

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: ({ entity, currentLevel, text }) => dispatch(toggleEntity({ entity, currentLevel, text }))
  }
}

const EntityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Entity)

export const Entities = ({ text, currentLevel, entities, klassName }) => {
  const entitiesA = entities.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div>
      <h2>{text} level {currentLevel}</h2>
      <div className={style.kanjiList}>
        { entitiesA.map((entity, i) => <EntityContainer key={i} text={text} klassName={klassName} entity={entity} currentLevel={currentLevel} /> )}
      </div>
    </div>
  )
}
