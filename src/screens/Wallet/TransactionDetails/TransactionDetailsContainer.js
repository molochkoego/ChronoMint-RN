/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import { selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { selectMarketPrices } from '@chronobank/market/redux/selectors'
import { getCurrentWallet } from '@chronobank/session/redux/selectors'
import { getCurrentEthWallet } from '@chronobank/ethereum/redux/selectors'
import { getBitcoinCurrentWallet } from '@chronobank/bitcoin/redux/selectors'
import { BLOCKCHAIN_ETHEREUM, ETH_PRIMARY_TOKEN } from '@chronobank/ethereum/constants'
import { BTC_PRIMARY_TOKEN } from '@chronobank/bitcoin/constants'
import { convertSatoshiToBTC } from '@chronobank/bitcoin/utils/amount'
import { amountToBalance } from '@chronobank/ethereum/utils/amount'
import TransactionDetails from './TransactionDetails'

const mapStateToProps = (state) => {
  const masterWalletAddress = getCurrentWallet(state)

  return {
    masterWalletAddress,
    prices: selectMarketPrices(state),
    selectedCurrency: selectCurrentCurrency(state),
    currentBTCWallet: getBitcoinCurrentWallet(masterWalletAddress)(state),
    currentETHWallet: getCurrentEthWallet(masterWalletAddress)(state),
  }
}

class TransactionDetailsContainer extends PureComponent {

  static propTypes = {
    masterWalletAddress: PropTypes.string,
    currentBTCWallet: PropTypes.shape({}),
    navigation: PropTypes.shape({}),
    currentETHWallet: PropTypes.shape({}),
    prices: PropTypes.shape({}),
  }


  handleFormatDate = (timestamp) => {
    let date = ''
    if (timestamp.toString().length > 10) {
      date = timestamp
        && moment(timestamp).format('LLLL')
        || 'No date info available'
    } else {
      date = timestamp
        && moment.unix(timestamp).format('LLLL')
        || 'No date info available'
    }
    return date
  }

  render () {
    const {
      selectedCurrency,
      navigation,
      currentBTCWallet,
      currentETHWallet,
      prices,
    } = this.props
    const { blockchain, type } = navigation.state.params
    const currentWallet = blockchain === BLOCKCHAIN_ETHEREUM
      ? currentETHWallet
      : currentBTCWallet
    const token = blockchain === BLOCKCHAIN_ETHEREUM
      ? ETH_PRIMARY_TOKEN
      : BTC_PRIMARY_TOKEN
    const tokenPrice = prices && prices[token] && prices[token][selectedCurrency] || 0
    const { selectedTransaction } = currentWallet
    const date = this.handleFormatDate(selectedTransaction.timestamp)
    const transactionParams = blockchain === BLOCKCHAIN_ETHEREUM
      ? {
        confirmations: selectedTransaction.latestBlock - selectedTransaction.blockNumber, 
        to: selectedTransaction.to,
        from: selectedTransaction.from,
        value: amountToBalance(selectedTransaction.value),
      }
      : {
        confirmations: selectedTransaction.confirmations, 
        to: selectedTransaction.inputs[0].address,
        from: selectedTransaction.outputs[0].address,
        value: convertSatoshiToBTC(selectedTransaction.outputs[0].value),
      }

    const {
      confirmations,
      to,
      from,
      value,
    } = transactionParams

    return (
      <TransactionDetails
        selectedCurrency={selectedCurrency}
        tokenPrice={tokenPrice}
        date={date}
        confirmations={confirmations}
        token={token}
        to={to}
        type={type}
        from={from}
        value={+value}
      />
    )
  }
}

TransactionDetailsContainer.propTypes = {
  bitcoinWallets: PropTypes.shape({}),
  ethereumWallets: PropTypes.shape({}),
  address: PropTypes.string,
  blockchain: PropTypes.string,
  selectedCurrency: PropTypes.string,
}

export default connect(mapStateToProps, null)(TransactionDetailsContainer)
