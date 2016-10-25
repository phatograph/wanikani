import fetchJsonp from 'fetch-jsonp'

export const fetchUserInfo = ({ currentLevel }) => (dispatch, getState) => {
  fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/user-information', { timeout: 10000 })
    .then(response => response.json())
    .then(userInfo => {
      currentLevel = currentLevel || userInfo.user_information.level

      dispatch(fetchUserInfoSuccess({ userInfo }))
      dispatch(fetchEntities({ currentLevel }))
    })
}

export const fetchEntities = ({ currentLevel }) => (dispatch, getState) => {
  Promise.all([
    dispatch(fetchRadical({ currentLevel })),
    dispatch(fetchKanji({ currentLevel })),
    dispatch(fetchVocab({ currentLevel }))
  ]).then(values => {
    dispatch(fetchRadicalSuccess({ radicals: values[0], currentLevel }))
    dispatch(fetchKanjiSuccess({ kanjis: values[1], currentLevel }))
    dispatch(fetchVocabSuccess({ vocabs: values[2], currentLevel }))
  })
}

export const fetchUserInfoSuccess = ({ userInfo }) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    userInfo,
  }
}

export const fetchRadical = ({ currentLevel }) => (dispatch, getState) => {
  const fetched = getState().getIn(['radicalReducer', `level${currentLevel}`])
  if (fetched) return { requested_information: fetched }

  return fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/radicals/${currentLevel}`, { timeout: 10000 })
    .then(response => response.json())
    .then(radicals => Promise.resolve(radicals))
}

export const fetchRadicalSuccess = ({ radicals, currentLevel }) => {
  return {
    type: 'FETCH_RADICAL_SUCCESS',
    radicals,
    currentLevel
  }
}

export const fetchKanji = ({ currentLevel }) => (dispatch, getState) => {
  const fetched = getState().getIn(['kanjiReducer', `level${currentLevel}`])
  if (fetched) return { requested_information: fetched }

  return fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/kanji/${currentLevel}`, { timeout: 10000 })
    .then(response => response.json())
    .then(kanjis => Promise.resolve(kanjis))
}

export const fetchKanjiSuccess = ({ kanjis, currentLevel }) => {
  return {
    type: 'FETCH_KANJI_SUCCESS',
    kanjis,
    currentLevel
  }
}

export const fetchVocab = ({ currentLevel  }) => (dispatch, getState) => {
  const fetched = getState().getIn(['vocabReducer', `level${currentLevel}`])
  if (fetched) return { requested_information: fetched }

  return fetchJsonp(`https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/vocabulary/${currentLevel}`, { timeout: 10000 })
    .then(response => response.json())
    .then(vocabs => Promise.resolve(vocabs))
}

export const fetchVocabSuccess = ({ vocabs, currentLevel }) => {
  return {
    type: 'FETCH_VOCAB_SUCCESS',
    vocabs,
    currentLevel
  }
}

export const toggleEntity = ({ entity, currentLevel, text }) => {
  return {
    type: `TOGGLE_${text.toUpperCase()}`,
    entity,
    currentLevel
  }
}
