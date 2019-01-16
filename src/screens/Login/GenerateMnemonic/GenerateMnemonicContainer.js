/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { 
  TouchableOpacity,
  Image,
  Clipboard,
 } from 'react-native'
import { generateMnemonic } from '@chronobank/ethereum/utils'
import PropTypes from 'prop-types'
import {copy_mnemonic} from '../../../images'
import GenerateMnemonic from './GenerateMnemonic'
import styles from './GenerateMnemonicStyles'

class GenerateMnemonicContainer extends React.PureComponent {

  state = {
    mnemonic: '',
  }


  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    return {
      ...params,
      headerRight: (
        <TouchableOpacity
          onPress={params.handleCopyMnemonic}
        >
          <Image
            source={copy_mnemonic}
            style={styles.copyIcon}
          />
        </TouchableOpacity>
      ),
    }
  }

  componentDidMount () {
    generateMnemonic()
      .then((resolve) => {
        this.setState({ mnemonic: resolve })
        this.props.navigation.setParams({ handleCopyMnemonic: this.handleCopyMnemonic })
      })
  }

  handleCopyMnemonic = () => {
    Clipboard.setString(this.state.mnemonic)
  }


  handleConfirm = () => {
    const { mnemonic } = this.state
    const { navigation } = this.props
    const { password } = navigation.state.params

    const params = {
      mnemonic,
      password,
    }

    navigation.navigate('ConfirmMnemonic', params)

  }

  render () {
    const { mnemonic } = this.state
    return (
      <GenerateMnemonic
        mnemonic={mnemonic}
        onConfirm={this.handleConfirm}
      />
    )
  }
}

GenerateMnemonicContainer.propTypes = {
  password: PropTypes.string,
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        password: PropTypes.string,
      }),
    }),
  }),
}

export default GenerateMnemonicContainer
