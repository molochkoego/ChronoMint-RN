/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import {
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import Separator from '../../Separator'
import TransactionIcon from '../../TransactionIcon'
import styles from './TransactionItemStyles'

export default class TransactionItem extends PureComponent {

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    latestTransactionDate: PropTypes.number,
    blockchain: PropTypes.string,
    address: PropTypes.string,
    symbol: PropTypes.string,
    type: PropTypes.oneOf(['receiving', 'sending']),
    hash: PropTypes.string,
    confirmations: PropTypes.number,
    tType: PropTypes.string,
    balance: PropTypes.string,
    onFormattedBalance: PropTypes.func,
    onTransactionClick: PropTypes.func,
  }

  render () {
    const {
      blockchain,
      hash,
      type,
      confirmations,
      tType,
      address,
      balance,
      symbol,
      onFormattedBalance,
      onTransactionClick,
    } = this.props


    const transactionStyle = type === 'sending'
      ? styles.sending
      : styles.receiving

    return (
      <TouchableWithoutFeedback
        onPress={() => onTransactionClick({ blockchain, hash, type })}
      >
        <View style={styles.item}>
          <Separator />
          <View style={styles.leftPart}>
            <TransactionIcon
              type={type}
              confirmations={confirmations}
            />
            <Text
              style={styles.itemText}
              ellipsizeMode='middle'
              numberOfLines={2}
            >
              {
                tType
              }
              {'\n'}
              {
                address
              }
            </Text>
          </View>
          <Text style={transactionStyle}>
            {
              onFormattedBalance(balance, symbol, type)
            }
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
