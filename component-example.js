import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { getNewJokeRequest } from '../../actions'
import {
  selectChuckNorrisLoading,
  selectChuckNorrisError,
  selectChuckNorrisJoke,
} from '../../selectors'

class JokeContainer extends React.Component {
  // Jest requires a component to have a constructor when running tests.
  // eslint-disable-next-line
  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    const { getNewJoke } = this.props
    getNewJoke()
  }

  render = () => {
    const { chuckNorrisJoke, chuckNorrisLoading, chuckNorrisError } = this.props

    if (chuckNorrisError) {
      return <FormattedMessage {...messages.error} />
    }

    if (chuckNorrisLoading) {
      return <FormattedMessage {...messages.loading} />
    }

    return <Text>{chuckNorrisJoke}</Text>
  }
}

JokeContainer.propTypes = {
  chuckNorrisLoading: PropTypes.bool.isRequired,
  chuckNorrisError: PropTypes.object,
  chuckNorrisJoke: PropTypes.string,
  getNewJoke: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  chuckNorrisLoading: selectChuckNorrisLoading(state),
  chuckNorrisError: selectChuckNorrisError(state),
  chuckNorrisJoke: selectChuckNorrisJoke(state),
})

const mapDispatchToProps = dispatch => ({
  getNewJoke: () => dispatch(getNewJokeRequest()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JokeContainer)
