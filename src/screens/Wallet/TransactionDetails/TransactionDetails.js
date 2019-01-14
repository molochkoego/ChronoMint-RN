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
    confirmations: PropTypes.number, //
    from: PropTypes.string,
    to: PropTypes.string,
    selectedCurrency: PropTypes.string, //
    token: PropTypes.string, //
    value: PropTypes.number,
    tokenPrice: PropTypes.number, //
    // fee: PropTypes.number,
    date: PropTypes.string, //
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
      // fee=0.00002,
      date,
    } = this.props

    const valueInCurrency = value * tokenPrice
    // const feeInCurrency = fee * tokenPrice

    return (
      <View style={styles.screenView}>        
        <View style={styles.transactionStatus}>
          <TransactionIcon
            confirmations={confirmations}
            mode='big'
            type={type}
          />
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
        {/* <LabeledItem
          labelText='Fee'
          labelAlign='top'
        >
          <Text>
            {`${token} ${fee}`}
            <Text style={styles.lightGreyText}>
              {`(${selectedCurrency} ${feeInCurrency})`}
            </Text>
          </Text>
        </LabeledItem> */}
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
