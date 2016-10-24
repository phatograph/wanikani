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

const Entity = React.createClass({
  componentDidMount() {
    this.active = false
    this.currentActive = null
  },

  componentDidUpdate() {
    if (document.querySelectorAll(`.${style.entityActive}`).length > 1) {
      this.currentActive.click()
      this.currentActive = null
    }
  },

  onClick(e) {
    e.preventDefault()
    this.currentActive = document.querySelector(`.${style.entityActive}`)
    this.active = !this.active
    this.forceUpdate()
  },

  render() {
    const { active, klassName, entity } = this.props

    return (
      <a href className={this.active ? `${klassName} ${style.entityActive}` : klassName} onClick={this.onClick}>
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
  }
})

export const Entities = ({ text, currentLevel, entities, klassName }) => {
  const entitiesA = entities.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div>
      <h2>{text} level {currentLevel}</h2>
      <div className={style.kanjiList}>
        { entitiesA.map((entity, i) => <Entity key={i} klassName={klassName} active={false} entity={entity} /> )}
      </div>
    </div>
  )
}
