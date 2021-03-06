/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import React, { PureComponent } from 'react'
import EnterPrivateKey from '../screens/EnterPrivateKey'
import withLogin from '../components/withLogin'

export type TEnterPrivateKeyContainerProps = {
  onPrivateKeyLogin: (privateKey: string) => void,
}

type TEnterPrivateKeyContainerState = {
  privateKey: string,
}

class EnterPrivateKeyContainer extends PureComponent<TEnterPrivateKeyContainerProps, TEnterPrivateKeyContainerState> {
  state = {
    privateKey: '',
  }

  handleChangePrivateKey = (privateKey: string) => {
    this.setState({ privateKey })
  }

  handleDone = () => {
    this.props.onPrivateKeyLogin(this.state.privateKey)

    this.props.navigator.push({
      screen: 'SetAccountPassword',
      title: 'Set Account Password',
      passProps: {
        privateKey: this.state.privateKey,
      },
    })
  }

  render () {
    return (<EnterPrivateKey
      onChangePrivateKey={this.handleChangePrivateKey}
      onDone={this.handleDone}
    />)
  }
}

export default withLogin(EnterPrivateKeyContainer)
