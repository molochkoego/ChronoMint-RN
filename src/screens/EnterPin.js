/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */
import React from 'react'
import { StyleSheet, View, TextInput, Platform } from 'react-native'
import I18n from 'react-native-i18n'
import { PIN_LENGTH } from '../utils/globals'

const bullets = Array(PIN_LENGTH).fill(1)

export default class EnterPin extends React.Component {

  state = {
    pin: '',
  }

  handlePin = (pin) => {
    this.setState({ pin })

    if (pin.length < PIN_LENGTH) return

    if (!this.props.pin) return this.gotoConfirmPin(pin)

    if (this.props.pin === pin) return this.gotoLogin()

    alert(I18n.t('EnterPin.pinsNotMatch'))
  }

  gotoConfirmPin = (pin) => {
    this.props.navigator.push({
      screen: 'EnterPin',
      title: I18n.t('EnterPin.confirmTitle'),
      passProps: {
        pin,
      },
    })
  }

  gotoLogin = () => {
    this.props.navigator.resetTo({
      screen: 'WalletsList',
      title: I18n.t('WalletsList.title'),
    })
  }

  renderBullet = (item, index) => (
    <View
      style={[
        styles.bullet,
        (this.state.pin.length > index) ? styles.bulletActive : {},
      ]}
      key={index}
    />
  )

  render () {
    return (
      <View style={styles.container}>
        { bullets.map(this.renderBullet) }
        <TextInput
          autoFocus
          style={styles.input}
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          onChangeText={this.handlePin}
          keyboardAppearance='dark'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 60,
  },
  bullet: {
    margin: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#A3A3CC',
  },
  bulletActive: {
    backgroundColor: 'white',
  },
  input: {
    display: 'none',
  },
})
