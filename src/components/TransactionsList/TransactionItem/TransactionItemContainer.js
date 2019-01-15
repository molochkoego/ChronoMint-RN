/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
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
import handleFormattedBalance from '../../../common/utils/transactionAmount'
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
        const thunkParams = { masterWalletAddress, selectedTransaction: {...result.payload.data, latestBlock} }
        blockchain === !BLOCKCHAIN_ETHEREUM
          ? thunkParams.address = currentBTCWallet.address
          : null
        transactionDetailsThunk(thunkParams)
          .then(() => {
            navigation.navigate('TransactionDetails', params)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('transactionDetailsThunk ERROR: ', error)
          })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('DETAILS REQUEST ERROR: ', error)
      })
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

    const transactionType = i18n.t(['TransactionsList', type])

    return (
      <TransactionItem
        blockchain={blockchain}
        hash={hash}
        confirmations={confirmations}
        transactionType={transactionType}
        address={address}
        balance={balance}
        symbol={symbol}
        type={type}
        onFormattedBalance={handleFormattedBalance}
        onTransactionClick={this.handleTransactionClick}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionItemContainer)
