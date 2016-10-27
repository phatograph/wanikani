import Immutable from 'immutable'
import fetchJsonp from 'fetch-jsonp'

import {
  fetchUserInfo, fetchUserInfoSuccess,
  fetchRadical, fetchRadicalSuccess,
  fetchKanji, fetchKanjiSuccess,
  fetchVocab, fetchVocabSuccess
} from './actions'

const requestedInformationHandler = (info) => {
  info = info.sort((a, b) => {
    const defaultSrs = { srs_numeric: 0, srs: 'novice', meaning_correct: 0, meaning_incorrect: 0 }
    if (!a.user_specific) a.user_specific = defaultSrs
    if (!b.user_specific) b.user_specific = defaultSrs

    a.uiActive = b.uiActive = false

    const diff = a.user_specific.srs_numeric - b.user_specific.srs_numeric

    if (diff > 0) return 1
    else if (diff < 0) return -1

    const pMeaningA = ~~(+a.user_specific.meaning_correct / (+a.user_specific.meaning_correct + +a.user_specific.meaning_incorrect) * 100)
    const pMeaningB = ~~(+b.user_specific.meaning_correct / (+b.user_specific.meaning_correct + +b.user_specific.meaning_incorrect) * 100)

    if (!a.user_specific.reading_correct) {
      return pMeaningA - pMeaningB
    }

    const pOverallA = ~~((a.user_specific.meaning_correct + a.user_specific.reading_correct) / (a.user_specific.meaning_correct + a.user_specific.meaning_incorrect + a.user_specific.reading_correct + a.user_specific.reading_incorrect) * 100)
    const pOverallB = ~~((b.user_specific.meaning_correct + b.user_specific.reading_correct) / (b.user_specific.meaning_correct + b.user_specific.meaning_incorrect + b.user_specific.reading_correct + b.user_specific.reading_incorrect) * 100)

    return pOverallA - pOverallB
  })

  return info
}

const toggleEntity = (state, action) => {
  const entityIndex = state.getIn([`level${action.currentLevel}`]).findIndex(x => x.get('character') == action.entity)
  const initialValue = state.getIn([`level${action.currentLevel}`, entityIndex, 'uiActive'])

  // Set all `uiActive` to false.
  state = state.set(`level${action.currentLevel}`, state.getIn([`level${action.currentLevel}`]).map(x => x.set('uiActive', false)))

  // Toogle only clicked entity.
  return state.updateIn([`level${action.currentLevel}`, entityIndex], x => x.set('uiActive', !initialValue))
}

export const userInfoReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_USER_INFO_SUCCESS':
      return Immutable.fromJS(action.userInfo.user_information)
    default:
      return state
  }
}

export const radicalReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_RADICAL_SUCCESS':
      action.radicals.requested_information = requestedInformationHandler(action.radicals.requested_information)
      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.radicals.requested_information))
    case 'TOGGLE_RADICALS':
      return toggleEntity(state, action)
    default:
      return state
  }
}

export const kanjiReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_KANJI_SUCCESS':
      action.kanjis.requested_information = requestedInformationHandler(action.kanjis.requested_information)
      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.kanjis.requested_information))
    case 'TOGGLE_KANJIS':
      return toggleEntity(state, action)
    default:
      return state
  }
}

export const vocabReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_VOCAB_SUCCESS':
      action.vocabs.requested_information = requestedInformationHandler(action.vocabs.requested_information)
      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.vocabs.requested_information))
    case 'TOGGLE_VOCABULARIES':
      return toggleEntity(state, action)
    default:
      return state
  }
}
