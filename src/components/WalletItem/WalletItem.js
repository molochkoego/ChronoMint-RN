/* @flow */
import * as React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { COLOR_BACKGROUND, COLOR_RED } from '../../constants/styles'

type Token = { id: string, amount: number }

type Transaction = { status?: 'receiving' | null }

type ExchangeType = { currency: string, amount: number }

type WalletMode = 'default' | 'shared' | 'locked'

type Props = {
  title: string,
  address: string,
  balance: {
    currency: string,
    amount: number
  },
  transactions?: Transaction[],
  tokens?: Token[],
  exchange?: ExchangeType,
  image?: number,
  mode?: WalletMode,
}

type IconProps = {
  image?: number,
  mode?: WalletMode,
}

const WalletImage = ({ image, mode }: IconProps) => (
  <View style={styles.walletImageContainer}>
    { (mode === 'default') && (
      <Image
        source={require('../../assets/images/wallet-badge-default.png')}
        style={styles.walletBadge}
        resizeMode='contain'
      />
    )}
    { (mode === 'shared') && (
      <Image
        source={require('../../assets/images/wallet-badge-shared.png')}
        style={styles.walletBadge}
        resizeMode='contain'
      />
    )}
    { (mode === 'locked') && (
      <Image
        source={require('../../assets/images/wallet-badge-locked.png')}
        style={styles.walletBadge}
        resizeMode='contain'
      />
    )}
    { image ? (
      <Image source={image} />
    ) : (
      <View style={styles.walletImageShape}>
        <Image source={require('../../assets/images/wallet.png')} />
      </View>
    )}
  </View>
)

const Transactions = ({ transactions }) => !transactions ? null : (
  !transactions[1] ? (
    <Image
      source={require('../../assets/images/transaction-receiving.png')}
    />
  ) : (
    <View style={styles.transactionsNumberContainer}>
      <Text style={styles.transactionsNumber}>
        {transactions.length}
      </Text>
    </View>
  )
)

const TokensList = ({ tokens }) => !(tokens || [])[0] ? null : (
  <Text style={styles.tokens}>
    {tokens[0].id} {tokens[0].amount.toFixed(2)}
    {tokens[1] && ', '}
    {tokens[2] ?
      `+ ${tokens.length - 1} more` :
      `${tokens[1].id} ${tokens[1].amount.toFixed(2)}`
    }
  </Text>
)

const Exchange = ({ exchange }: ExchangeType) => !exchange ? null : (
  <Text style={styles.exchange}>
    {exchange.currency} {exchange.amount.tol}
  </Text>
) 

export default class WalletItem extends React.Component<Props, {}> {
  render () {
    const { title, address, balance } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.transactions}>
          <Transactions transactions={this.props.transactions} />
        </View>
        <View style={styles.content}>
          <WalletImage image={this.props.image} mode={this.props.mode} />
          <View style={styles.contentColumn}>
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.address}>
              {address}
            </Text>
            <Text style={styles.balance}>
              {balance.currency} {balance.amount.toFixed(2)}
            </Text>
            <TokensList tokens={this.props.tokens} />
            <Exchange exchange={this.props.exchange} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BACKGROUND,
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingBottom: 40,
  },
  transactions: {
    flexDirection: 'row',
    margin: 4,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  transactionsNumberContainer: {
    height: 20,
    minWidth: 20,
    backgroundColor: COLOR_RED,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  transactionsNumber: {
    color: COLOR_BACKGROUND,
    fontWeight: '900',
  },
  content: {
    flexDirection: 'row',
  },
  contentColumn: {
    flex: 1,
  },
  walletImageContainer: {
    marginHorizontal: 16,
  },
  walletImageShape: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#614DBA',
  },
  walletBadge: {
    position: 'absolute',
    zIndex: 1,
    left: -4,
    width: 20,
    height: 20,
  },
  title: {
    marginTop: 8,
    fontWeight: '700',
  },
  address: {
    marginTop: 4,
    fontWeight: '200',
    fontSize: 12,
  },
  balance: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
  },
  tokens: {
    color: '#7F7F7F',
    fontWeight: '200',
    marginTop: 4,
  },
  exchange: {
    color: '#7F7F7F',
    fontWeight: '200',
    marginTop: 4,
  },
})
