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
