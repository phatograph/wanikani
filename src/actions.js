export const fetchUserInfo = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_USER_INFO',
    currentLevel,
    dispatch
  }
}

export const fetchUserInfoSuccess = ({ currentLevel, userInfo, dispatch }) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    currentLevel,
    userInfo,
    dispatch
  }
}

export const fetchRadical = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_RADICAL',
    currentLevel,
    dispatch
  }
}

export const fetchRadicalSuccess = ({ radicals, currentLevel }) => {
  return {
    type: 'FETCH_RADICAL_SUCCESS',
    radicals,
    currentLevel
  }
}

export const fetchKanji = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_KANJI',
    currentLevel,
    dispatch
  }
}

export const fetchKanjiSuccess = ({ kanjis, currentLevel }) => {
  return {
    type: 'FETCH_KANJI_SUCCESS',
    kanjis,
    currentLevel
  }
}

export const fetchVocab = ({ currentLevel, dispatch }) => {
  return {
    type: 'FETCH_VOCAB',
    currentLevel,
    dispatch
  }
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
