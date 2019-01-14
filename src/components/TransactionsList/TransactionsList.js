/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native'
import { BLOCKCHAIN_ETHEREUM, ETH_PRIMARY_TOKEN } from '@chronobank/ethereum/constants'
import { BLOCKCHAIN_BITCOIN, BTC_PRIMARY_TOKEN } from '@chronobank/bitcoin/constants'
import moment from 'moment'
import PropTypes from 'prop-types'
import Separator from '../Separator'
import TransactionItem from './TransactionItem'
import styles from './TransactionsListStyles'

const tokenSymbols = {
  [BLOCKCHAIN_BITCOIN]: BTC_PRIMARY_TOKEN,
  [BLOCKCHAIN_ETHEREUM]: ETH_PRIMARY_TOKEN,
}

export default class TransactionsList extends PureComponent {

  static propTypes = {
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string,
        balance: PropTypes.string,
        confirmations: PropTypes.number,
      })
    ),
    refreshTransactionsList: PropTypes.func,
  }

  componentDidMount () {
    const trLoadingStatus = this.props.mainWalletTransactionLoadingStatus
    if (!trLoadingStatus.isFetching &&
      !trLoadingStatus.isInited
    ) {
      this.props.refreshTransactionsList()
    }
  }

  keyExtractor = (item, index) =>
    '' + item.address + '_' + item.blockNumber + '_' + index

  renderItem = ({item}) => {
    const { address, blockchain, navigation } = this.props
    const type = address.toLowerCase() === item.from.toLowerCase()
      ? 'sending'
      : 'receiving'
    const symbol = tokenSymbols[blockchain]

    return (
      <TransactionItem
        item={item}
        type={type}
        symbol={symbol}
        navigation={navigation}
        blockchain={blockchain}
      />
    )
  }


  render () {
    const {
      transactions,
      mainWalletTransactionLoadingStatus,
      latestTransactionDate,
    } = this.props
    
    let lastTransactionDate
    if (!latestTransactionDate) {
      lastTransactionDate = 'No date info available'
    } else {
      if (latestTransactionDate.toString().length > 10) {
        lastTransactionDate = latestTransactionDate
          && moment(latestTransactionDate).format('DD MMMM YYYY')
          || 'No date info available'
      } else {
        lastTransactionDate = latestTransactionDate
          && moment.unix(latestTransactionDate).format('DD MMMM YYYY')
          || 'No date info available'
      }
    }

    const TransactionsLoading = () => (
      <View style={styles.transactionsListContainer}>
        <Text style={styles.transactionsListTitle}>
          Loading Transactions ...
        </Text>
        <Separator />
        <ActivityIndicator />
      </View>
    )

    const NoTransactionsExists = () => (
      <View style={styles.transactionsListContainer}>
        <Text style={styles.transactionsListTitle}>
          No transactions at the moment.
        </Text>
      </View>
    )

    /** This code block temporary disabled */
    // const RefreshTransactions = () => (
    //   <View style={styles.transactionsListContainer}>
    //     <TouchableOpacity
    //       onPress={refreshTransactionsList}
    //       style={styles.refreshTouch}
    //     >
    //       <Text style={styles.refreshText}>
    //         No transactions available. Tap to refresh.
    //       </Text>
    //       <View style={styles.refreshImage}>
    //         <Image
    //           source={require('../images/temporary-reload-icon.png')}
    //         />
    //       </View>
    //     </TouchableOpacity>
    //   </View>
    // )

    const LoadedTransactions = () => {
      return (
        <View style={styles.transactionsListContainer}>
          <Text style={styles.transactionsListTitle}>
            {
              lastTransactionDate
            }
          </Text>
          <Separator />
          <FlatList
            data={transactions}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
      )
    }

    // FIXME: [AO] in some conditions it can return null
    if (mainWalletTransactionLoadingStatus.isFetching) {
      return (<TransactionsLoading />)
    } else {
      if (mainWalletTransactionLoadingStatus.isInited) {
        if (transactions && transactions.length) {
          return (<LoadedTransactions />)
        } else {
          return (<NoTransactionsExists />)
        }
      } else {
        return (<TransactionsLoading />)
      }
    }
  }
}
