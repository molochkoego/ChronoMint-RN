/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { bitcoinDropSelectedTransaction } from '@chronobank/bitcoin/redux/thunks'
import { ethereumDropSelectedTransaction } from '@chronobank/ethereum/redux/thunks'
import { selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { getCurrentWallet } from '@chronobank/session/redux/selectors'
import { getCurrentEthWallet } from '@chronobank/ethereum/redux/selectors'
import { getBitcoinCurrentWallet } from '@chronobank/bitcoin/redux/selectors'
import { BLOCKCHAIN_ETHEREUM, ETH_PRIMARY_TOKEN } from '@chronobank/ethereum/constants'
import Wallet from './Wallet'

const mapStateToProps = (state) => {
  const masterWalletAddress = getCurrentWallet(state)

  return {
    masterWalletAddress,
    selectedCurrency: selectCurrentCurrency(state),
    currentBTCWallet: getBitcoinCurrentWallet(masterWalletAddress)(state),
    currentETHWallet: getCurrentEthWallet(masterWalletAddress)(state),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  bitcoinDropSelectedTransaction,
  ethereumDropSelectedTransaction,
}, dispatch)

class WalletContainer extends Component {
  constructor (props) {
    super(props)
  }

  static propTypes = {
    bitcoinDropSelectedTransaction: PropTypes.func,
    ethereumDropSelectedTransaction: PropTypes.func,
    masterWalletAddress: PropTypes.string,
    currentBTCWallet: PropTypes.shape({}),
    currentETHWallet: PropTypes.shape({}),
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      state: PropTypes.shape({
        params: PropTypes.shape({
          blockchain: PropTypes.string,
        }),
      }),
    }),
  }

  handleDropSelectedTransaction = () => {
    const { 
      navigation,
      bitcoinDropSelectedTransaction,
      ethereumDropSelectedTransaction,
      masterWalletAddress,
      currentBTCWallet,
      currentETHWallet,
    } = this.props
    const { blockchain } = navigation.state.params
    const currentWallet = blockchain === BLOCKCHAIN_ETHEREUM
      ? currentETHWallet
      : currentBTCWallet
    if(currentWallet.hasOwnProperty('selectedTransaction')){
      const removeSelectedTransaction = blockchain === BLOCKCHAIN_ETHEREUM
        ? ethereumDropSelectedTransaction
        : bitcoinDropSelectedTransaction
      const params = { masterWalletAddress }
      blockchain !== BLOCKCHAIN_ETHEREUM ? params.address = currentWallet.address : null
      removeSelectedTransaction(params)
        // eslint-disable-next-line no-console
        .then(() => console.log('Removed selectedTx: '))
        // eslint-disable-next-line no-console
        .catch((error) => console.log('Removed ERROR: ', error))
    }
  }


  handleSend = () => {
    // TODO: [AO] This is temporary limitation. At the moment we can't send not-ETH funds
    const { currentETHWallet, navigation } = this.props
    const {
      navigate,
      state,
    } = navigation
    const {
      blockchain,
    } = state.params
    const params = {
      blockchain: state.params.blockchain,
    }
    const primaryToken = currentETHWallet.tokens[ETH_PRIMARY_TOKEN]

    blockchain === BLOCKCHAIN_ETHEREUM ? params.token = primaryToken : null

    const path = blockchain === BLOCKCHAIN_ETHEREUM ? 'SendEth' : 'Send'
    navigate(path, params)
  }

  handleReceive = () => {
    const { navigation, currentBTCWallet, currentETHWallet } = this.props
    const { state, navigate } = navigation
    const { blockchain } = state.params
    const currentWallet = blockchain === BLOCKCHAIN_ETHEREUM
      ? currentETHWallet
      : currentBTCWallet
    const params = {
      currentWallet,
      blockchain,
    }
    navigate('Receive', params)
  }

  handleIndexChange = (index) =>
    this.setState({
      // [AO] This state is using via onIndexChange below
      // eslint-disable-next-line react/no-unused-state
      index,
    })

  render () {
    const {
      blockchain,
    } = this.props.navigation.state.params
    const { currentBTCWallet, currentETHWallet, navigation, selectedCurrency } = this.props
    const currentWallet = blockchain === BLOCKCHAIN_ETHEREUM
      ? currentETHWallet
      : currentBTCWallet
    const latestTransactionDate =
      currentWallet &&
      currentWallet.transactions &&
      currentWallet.transactions.latestTxDate
      || null
    const transactions =
      currentWallet &&
      currentWallet.transactions &&
      currentWallet.transactions.txList
      || []
    return (
      <Wallet
        blockchain={blockchain}
        navigation={navigation}
        latestTransactionDate={latestTransactionDate}
        transactions={transactions}
        address={currentWallet.address}
        selectedCurrency={selectedCurrency}
        onSend={this.handleSend}
        onReceive={this.handleReceive}
        onDropSelectedTransaction={this.handleDropSelectedTransaction}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
