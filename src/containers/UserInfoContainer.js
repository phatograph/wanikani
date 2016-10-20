import React from 'react'
import { connect } from 'react-redux'

const UserInfo = React.createClass({
  componentDidMount() {
    this.props.onLoad()
  },
  render() {
    return (
      <div>
        UserInfo
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {}
  }
}

export const UserInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
