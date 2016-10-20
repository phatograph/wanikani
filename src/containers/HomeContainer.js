import { connect } from 'react-redux'
import Home from './Home.jsx'

export const userInfo = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS_SUCCESS':
      return {}
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    objects: []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
