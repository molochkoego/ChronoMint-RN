/* Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import {
  Text,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import TransactionIcon from '../../../components/TransactionIcon'
import LabeledItem from '../../../components/LabeledItem'
import styles from './TransactionDetailsStyles'

export default class TransactionDetails extends PureComponent {

  static propTypes = {
    confirmations: PropTypes.number,
    from: PropTypes.string,
    to: PropTypes.string,
    selectedCurrency: PropTypes.string,
    token: PropTypes.string,
    value: PropTypes.number,
    tokenPrice: PropTypes.number,
    date: PropTypes.string,
    type: PropTypes.string,
  }

  handleTransactionStatusRender = (confirmations) => {
    const { type } = this.props
    if (confirmations <= 6) {
      return (
        <LabeledItem
          labelText='Estimate'
          labelAlign='top'
        >
          <Text style={styles.lightGreyText}>
            {`Up to 5-10 minutes(${confirmations}/6 Confirmations)`}
          </Text>
        </LabeledItem>
      )
    } else {
      return (
        <Text style={styles.statusLabel}>
          {type === 'sending' ? 'Sent' : 'Received'}
        </Text>
      )
    }
  }


  render () {
    const {
      confirmations,
      from,
      to,
      selectedCurrency,
      token,
      value,
      tokenPrice,
      type,
      date,
    } = this.props

    const valueInCurrency = value * tokenPrice

    return (
      <View style={styles.screenView}>
        <View style={styles.transactionStatus}>
          <TransactionIcon
            confirmations={confirmations}
            mode='big'
            type={type}
          />
          <View style={styles.transactionProgress}>
            {this.handleTransactionStatusRender(confirmations)}
          </View>
        </View>
        <LabeledItem
          labelText='From'
          labelAlign='top'
        >
          <Text>
            {from}
          </Text>
        </LabeledItem>
        <LabeledItem
          labelText='To'
          labelAlign='top'
        >
          <Text>
            {to}
          </Text>
        </LabeledItem>
        <LabeledItem
          labelText={`${token} ${value}`}
          labelType='currencyColored'
          labelAlign='top'
        >
          <Text style={styles.lightGreyText}>
            {`${selectedCurrency} ${valueInCurrency}`}
          </Text>
        </LabeledItem>
        <LabeledItem
          labelText='Date'
          labelAlign='top'
        >
          <Text style={styles.lightGreyText}>
            {date}
          </Text>
        </LabeledItem>
      </View>
    )
  }
}
