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
import WalletImage from 'components/WalletImage'
import TokensListContainer, { type TokenInfo } from 'containers/TokensListContainer'
import WalletBalanceContainer from 'containers/WalletBalanceContainer'
import isNumber from 'utils/numeric'

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
  selectedCurrency: string,
  onItemPress(): void,
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

const RenderTokensList = (list: TokenInfo[]) => {

  const getDetailedToken = (tokenInfo: TokenInfo) => {
    const symbol: ?string = Object.keys(tokenInfo)[0]
    const amount: ?number = Object.values(tokenInfo)[0]
    const formattedAmount = isNumber(amount)
      ? amount.toFixed(2)
      : '-.--'
    return [symbol || '', formattedAmount].join(': ')
  }

  const [firstToken, secondToken, ...restTokens] = list
  let tokensString = ''

  if (firstToken) {
    tokensString = getDetailedToken(firstToken)
    if (secondToken && restTokens.length) {
      tokensString = [tokensString, '+', restTokens.length, 'more'].join(' ')
    }
    if (secondToken && !restTokens.length) {
      tokensString = [tokensString, getDetailedToken(secondToken)].join(' ')
    }
  }

  return (
    <Text style={styles.tokens}>
      {tokensString || ''}
    </Text>
  )
}

const RenderWalletBalance = (selectedCurrency: string) => (balance: ?number) => {

  const formattedBalance = isNumber(balance)
    ? balance.toFixed(2)
    : '-.--'

  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceText}>
        {
          selectedCurrency
        }
      </Text>
      <Text style={[styles.balanceText, styles.balanceNumber]}>
        {
          formattedBalance
        }
      </Text>
    </View>
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
    this.props.onItemPress()
  }

  render () {
    const {
      address,
      blockchain,
      selectedCurrency,
    } = this.props

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
              style={styles.image}
            />
            <View style={styles.contentColumn}>
              <Text style={styles.title}>
                {
                  `My ${blockchain} Wallet`
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
              <WalletBalanceContainer
                blockchain={blockchain}
                render={RenderWalletBalance(selectedCurrency)}
              />
              <TokensListContainer
                blockchain={blockchain}
                render={RenderTokensList}
              />
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
