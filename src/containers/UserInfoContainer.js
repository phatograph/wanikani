import React from 'react'
import { connect } from 'react-redux'
import fetchJsonp from 'fetch-jsonp'

const UserInfo = React.createClass({
  componentDidMount() {
    this.props.onLoad()
  },
  render() {
    return (
      <div>
        UserInfo {this.props.userInfo.user_information ? this.props.userInfo.user_information.username : 'loading'}
      </div>
    )
  }
})

const fetchUserInfo = (dispatch) => {
  return {
    type: 'FETCH_USER_INFO',
    dispatch
  }
}

const fetchUserInfoSuccess = (userInfo) => {
  return {
    type: 'FETCH_USER_INFO_SUCCESS',
    userInfo
  }
}

export const userInfo = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_USER_INFO':
      fetchJsonp('https://www.wanikani.com/api/user/8a026e69d462dd088b40b12b99437328/user-information')
      .then(response => response.json())
      .then(json => action.dispatch(fetchUserInfoSuccess(json)))
      return state
    case 'FETCH_USER_INFO_SUCCESS':
      return action.userInfo
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => dispatch(fetchUserInfo(dispatch))
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
