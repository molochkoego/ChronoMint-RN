/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import React, { PureComponent }  from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import styles from 'components/styles/WalletListItemStyles'
import WalletImage, { type TWalletMode } from 'components/WalletImage'

type TPrices = {
  [token: string]: {
    [currency: string]: number
  }
}
type TCalculatedToken = TPrices[]
export type TCalculatedTokenCollection = TCalculatedToken[]
export type TWalletsListItemProps = {
  address: string,
  blockchain: string,
  tokens: TCalculatedToken,
  walletInfo: any,
  walletMode?: ?TWalletMode,
  selectedCurrency: string,
  onItemPress(
    blockchain: string,
    address: string,
  ): void,
}

const Transactions = ({ transactions }) => !transactions ? null : (
  !transactions[1] ? (
    <Image
      source={require('../images/indicator-receiving-0.png')}
    />
  ) : (
    <View style={styles.transactionsNumberContainer}>
      <Text style={styles.transactionsNumber}>
        {transactions.length}
      </Text>
    </View>
  )
)

// TODO: [AO] Refactoring required
const TokensList = ({ tokens }) => {
  if (!tokens || !tokens.length) {
    return (
      <Text style={styles.tokens}>
        {''}
      </Text>
    )
  }
  const tokensIndex = Object.create(null)
  tokens
    .forEach( (tokenObj) => {
      const tKey = Object.keys(tokenObj)[0]
      tokensIndex[tKey] = tokenObj[tKey]
    })
  let tokensStrings = tokens
    .map( (tokenObj) => Object.keys(tokenObj)[0])
    .sort()
    .reduce( (accumulator, tokenSymbol) => {
      accumulator.push([tokenSymbol, tokensIndex[tokenSymbol].amount.toFixed(2)].join(': '))
      return accumulator
    }, [])

  if (tokensStrings && tokensStrings.length > 2) {
    tokensStrings = [
      tokensStrings[0],
      ['+', tokensStrings.length - 1, 'more'].join(' '),
    ]
  }
  tokensStrings = tokensStrings && tokensStrings.join(', ')

  return (
    <Text style={styles.tokens}>
      {tokensStrings || ''}
    </Text>
  )
}

// TEMPORARY DISABLED
//
// const Exchange = ({ exchange }) => !exchange ? null : (
//   <Text style={styles.exchange}>
//     {exchange.currency} {exchange.amount}
//   </Text>
// )

export default class WalletsListItem extends PureComponent<TWalletsListItemProps> {

  constructor (props: TWalletsListItemProps) {
    super(props)
  }

  handleOnPress = () => {
    const {
      address,
      blockchain,
    } = this.props
    this.props.onItemPress(blockchain, address)
  }

  render () {
    const {
      address,
      blockchain,
      walletInfo,
      walletMode,
    } = this.props

    const {
      balance,
      tokens,
    } = walletInfo

    let walletTitle = `My ${blockchain} Wallet`
    if (walletMode === 'shared') {
      walletTitle = 'My Shared Wallet'
    }
    if (walletMode === 'timeLocked') {
      walletTitle = 'My TimeLocked Wallet'
    }

    const textCurrencyBalance = [
      this.props.selectedCurrency,
      balance !== undefined && balance.toFixed(2) || '--.--',
    ].join(' ')

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.handleOnPress}
      >
        <View>
          <View style={styles.transactions}>
            <Transactions transactions={[1]} />
          </View>
          <View style={styles.content}>
            <WalletImage
              blockchain={blockchain}
              walletMode={walletMode}
              style={styles.image}
            />
            <View style={styles.contentColumn}>
              <Text style={styles.title}>
                {
                  walletTitle
                }
              </Text>
              <Text
                style={styles.address}
                ellipsizeMode='middle'
                numberOfLines={1}
              >
                {
                  address
                }
              </Text>
              <Text style={styles.balance}>
                {
                  textCurrencyBalance
                }
              </Text>
              <TokensList tokens={tokens} />
              {/* TEMPORARY DISABLED
                <View>
                  <Exchange exchange={wallet.exchange} />
                </View>
              */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
