import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { toggleEntity } from './../actions'
import moment from 'moment'

import style from './../../assets/css/style.css'

const Char = ({ entity }) => {
  if (entity.get('character')) {
    return (<div>{entity.get('character')}</div>)
  }

  return (
    <div className={style.characterImgWrapper}>
      <img className={style.characterImg} src={entity.get('image')} />
    </div>
  )
}

const Details = ({ us }) => (
  <div className={style.details}>
    <table>
      <tbody>
        <tr>
          <td>Next available</td><td><time title={(new Date(us.available_date * 1000)).toString()}>{ moment(us.available_date * 1000).fromNow() }</time></td>
        </tr>
        { us.reading_correct ? (
          <tr>
            <td>Total correct</td><td>{ us.meaning_correct + us.reading_correct } / { us.meaning_correct + us.meaning_incorrect + us.reading_correct + us.reading_incorrect } ({ ~~((us.meaning_correct + us.reading_correct) / (us.meaning_correct + us.meaning_incorrect + us.reading_correct + us.reading_incorrect) * 100) } %)</td>
          </tr>
          ) : null
        }
        <tr>
          <td>Meaning correct</td><td>{ us.meaning_correct } / { us.meaning_correct + us.meaning_incorrect } ({ ~~(+us.meaning_correct / (+us.meaning_correct + +us.meaning_incorrect) * 100) } %)</td>
        </tr>
        <tr>
          <td>Meaning steak (max)</td><td>{ us.meaning_current_streak } ({ us.meaning_max_streak })</td>
        </tr>
        { us.reading_correct ? (
          <tr>
            <td>Reading correct</td><td>{ us.reading_correct } / { us.reading_correct + us.reading_incorrect } ({ ~~(+us.reading_correct / (+us.reading_correct + +us.reading_incorrect) * 100)  } %)</td>
          </tr>
          ) : null
        }
        { us.reading_correct ? (
          <tr>
            <td>Reading steak (max)</td><td>{ us.reading_current_streak } ({ us.reading_max_streak })</td>
          </tr>
          ) : null
        }
      </tbody>
    </table>
  </div>
)

const Entity = ({ wLink, text, klassName, entity, currentLevel, onClick }) => (
  <div href className={entity.get('uiActive') ? `${klassName} ${style.entityActive}` : `${klassName} ${style[entity.getIn(['user_specific', 'srs'])]}`} onClick={(e) => { e.preventDefault(); onClick({ entity: entity.get('character'), currentLevel, text }) }}>
    <div className={style.wrapper}>
      <div className={style.character}><Char entity={ entity } /></div>
      <div className={style.srsLevel}>
        Lvl&nbsp;
        { entity.getIn(['user_specific', 'srs_numeric']) }
        &nbsp;
        { entity.getIn(['user_specific', 'srs']) }
      </div>
      { entity.get('uiActive') ? <a className={style.entityLink} target="_blank" onClick={ (e) => e.stopPropagation() } href={`https://www.wanikani.com/${wLink}/${ wLink == 'radicals' ? entity.get('meaning') : entity.get('character') }`}>details</a> : null }
      { entity.get('uiActive') && entity.getIn(['user_specific', 'srs_numeric']) > 0 ? <Details us={entity.get('user_specific').toJS()} /> : null }
    </div>
  </div>
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

export const Entities = ({ wLink, text, currentLevel, entities, klassName }) => {
  const entitiesA = entities.get(`level${currentLevel}`, Immutable.List()).toArray()

  return (
    <div className={`handle${text}`}>
      <h2>{text} level {currentLevel}</h2>
      <div className={style.entityList}>
        { entitiesA.map((entity, i) => <EntityContainer key={i} wLink={wLink} text={text} klassName={klassName} entity={entity} currentLevel={currentLevel} /> )}
      </div>
    </div>
  )
}
