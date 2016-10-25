import Immutable from 'immutable'
import fetchJsonp from 'fetch-jsonp'

import {
  fetchUserInfo, fetchUserInfoSuccess,
  fetchRadical, fetchRadicalSuccess,
  fetchKanji, fetchKanjiSuccess,
  fetchVocab, fetchVocabSuccess
} from './actions'

const requestedInformationHandler = (a, b) => {
  const defaultSrs = { srs_numeric: 0, srs: 'novice' }
  if (!a.user_specific) a.user_specific = defaultSrs
  if (!b.user_specific) b.user_specific = defaultSrs

  a.uiActive = b.uiActive = false

  return a.user_specific.srs_numeric - b.user_specific.srs_numeric
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
        action.dispatch(fetchRadical({
          currentLevel: action.currentLevel,
          dispatch: action.dispatch
        }))

        action.dispatch(fetchKanji({
          currentLevel: action.currentLevel,
          dispatch: action.dispatch
        }))

        action.dispatch(fetchVocab({
          currentLevel: action.currentLevel,
          dispatch: action.dispatch
        }))
      }, 10)

      return Immutable.fromJS(action.userInfo.user_information)
    default:
      return state
  }
}

export const radicalReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_RADICAL':
      if (!state.get(`level${action.currentLevel}`)) {
        fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/radicals/${action.currentLevel}`, { timeout: 10000 })
          .then(response => response.json())
          .then(radicals => action.dispatch(fetchRadicalSuccess({ radicals, currentLevel: action.currentLevel })))
      }
      else {
        setTimeout(() => {
          action.dispatch({ type: 'FETCH_RADICAL_CACHE' })
        }, 10)
      }

      return state
    case 'FETCH_RADICAL_SUCCESS':
      action.radicals.requested_information = action.radicals.requested_information.sort(requestedInformationHandler)
      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.radicals.requested_information))
    case 'FETCH_RADICAL_CACHE':
    default:
      return state
  }
}

export const kanjiReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_KANJI':
      if (!state.get(`level${action.currentLevel}`)) {
        fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/${action.currentLevel}`, { timeout: 10000 })
          .then(response => response.json())
          .then(kanjis => action.dispatch(fetchKanjiSuccess({ kanjis, currentLevel: action.currentLevel })))
      }
      else {
        setTimeout(() => {
          action.dispatch({ type: 'FETCH_KANJI_CACHE' })
        }, 10)
      }

      return state
    case 'FETCH_KANJI_SUCCESS':
      action.kanjis.requested_information = action.kanjis.requested_information.sort(requestedInformationHandler)
      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.kanjis.requested_information))
    case 'FETCH_KANJI_CACHE':
    default:
      return state
  }
}

export const vocabReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'FETCH_VOCAB':
      if (!state.get(`level${action.currentLevel}`)) {
        fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/vocabulary/${action.currentLevel}`, { timeout: 10000 })
          .then(response => response.json())
          .then(vocabs => action.dispatch(fetchVocabSuccess({ vocabs, currentLevel: action.currentLevel })))
      }
      else {
        setTimeout(() => {
          action.dispatch({ type: 'FETCH_VOCAB_CACHE' })
        }, 10)
      }

      return state
    case 'FETCH_VOCAB_SUCCESS':
      action.vocabs.requested_information = action.vocabs.requested_information.sort(requestedInformationHandler)
      return state.set(`level${action.currentLevel}`, Immutable.fromJS(action.vocabs.requested_information))
    case 'FETCH_VOCAB_CACHE':
    default:
      return state
  }
}

export const entityReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case 'TOGGLE_ENTITY':
      console.log(action.entity)
      return state
    default:
      return state
  }
}
