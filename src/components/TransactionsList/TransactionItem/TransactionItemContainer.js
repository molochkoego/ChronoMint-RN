/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBlockNumber } from '@chronobank/ethereum/middleware/thunks'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/ethereum/constants'
import { ethereumSelectTransaction } from '@chronobank/ethereum/redux/thunks'
import { bitcoinSelectTransaction } from '@chronobank/bitcoin/redux/thunks'
import { requestEthereumTransactionByHash } from '@chronobank/ethereum/service/api'
import { requestBitcoinTransactionByHash } from '@chronobank/bitcoin/service/api'
import { getCurrentWallet } from '@chronobank/session/redux/selectors'
import { getBitcoinCurrentWallet } from '@chronobank/bitcoin/redux/selectors'
import isNumber from '../../../common/utils/numeric'
import i18n from '../../../locales/translation'
import TransactionItem from './TransactionItem'

const mapStateToProps = (state) => {
  const masterWalletAddress = getCurrentWallet(state)

  return {
    masterWalletAddress: getCurrentWallet(state),
    currentBTCWallet: getBitcoinCurrentWallet(masterWalletAddress)(state),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestEthereumTransactionByHash,
  requestBitcoinTransactionByHash,
  ethereumSelectTransaction,
  bitcoinSelectTransaction,
  getBlockNumber,
}, dispatch)

class TransactionItemContainer extends PureComponent {

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    masterWalletAddress: PropTypes.string,
    currentBTCWallet: PropTypes.shape({}),
    getBlockNumber: PropTypes.func,
    ethereumSelectTransaction: PropTypes.func,
    bitcoinSelectTransaction: PropTypes.func,
    requestEthereumTransactionByHash: PropTypes.func,
    requestBitcoinTransactionByHash: PropTypes.func,
    latestTransactionDate: PropTypes.number,
    blockchain: PropTypes.string,
    address: PropTypes.string,
    item: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      balance: PropTypes.string,
      confirmations: PropTypes.number,
    }),
    symbol: PropTypes.string,
    type: PropTypes.oneOf(['receiving', 'sending']),
  }

  handleFormattedBalance = (balance, symbol, type) => {
    if (!balance) {
      return ''
    }
    let numBalance
    if (isNumber(balance)) {
      numBalance = balance
    } else {
      if (balance instanceof BigNumber) {
        numBalance = balance.toNumber()
      } else {
        numBalance = parseInt(balance)
      }
    }
    const isbalanceTooSmall = numBalance > 0 && numBalance < 0.01
    let format = isbalanceTooSmall ? '%u%n+' : '%u%n  '
    format = [
      (type === 'sending' ? '-' : '+'),
      format,
    ].join(' ')

    return i18n.toCurrency(numBalance, { precision: 2, unit: ` ${symbol} `, format })

  }

  handleTransactionClick = async ({ blockchain, hash, type }) => {
    const {
      requestEthereumTransactionByHash,
      requestBitcoinTransactionByHash,
      ethereumSelectTransaction,
      bitcoinSelectTransaction,
      masterWalletAddress,
      currentBTCWallet,
      getBlockNumber,
      navigation,
    } = this.props

    const params = {
      blockchain,
      type,
    }

    const transactionDetailsRequest = blockchain === BLOCKCHAIN_ETHEREUM
      ? requestEthereumTransactionByHash
      : requestBitcoinTransactionByHash

    const transactionDetailsThunk = blockchain === BLOCKCHAIN_ETHEREUM
      ? ethereumSelectTransaction
      : bitcoinSelectTransaction
    const latestBlock = blockchain === BLOCKCHAIN_ETHEREUM ? await getBlockNumber() : null

    transactionDetailsRequest(hash)
      .then((result) => {
        const thunkParams = { masterWalletAddress, selectedTransaction: result.payload.data }
        blockchain === BLOCKCHAIN_ETHEREUM
          ? thunkParams.selectedTransaction.confirmations = latestBlock - result.payload.data.blockNumber
          : thunkParams.address = currentBTCWallet.address
        transactionDetailsThunk(thunkParams)
          .then(() => {
            navigation.navigate('TransactionDetails', params)
          })
          // eslint-disable-next-line no-console
          .catch((error) => console.log('transactionDetailsThunk ERROR: ', error))
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log('DETAILS REQUEST ERROR: ', error))
  }

  render () {
    const { type, symbol, item, blockchain/*, navigation*/ } = this.props
    const {
      from,
      to,
      confirmations,
      balance,
      hash,
    } = item

    const address = type === 'sending' ? to : from

    const tType = i18n.t(['TransactionsList', type])

    return (
      <TransactionItem
        blockchain={blockchain}
        hash={hash}
        confirmations={confirmations}
        tType={tType}
        address={address}
        balance={balance}
        symbol={symbol}
        type={type}
        onFormattedBalance={this.handleFormattedBalance}
        onTransactionClick={this.handleTransactionClick}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionItemContainer)
