/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import BigNumber from 'bignumber.js'
import i18n from '../../locales/translation'
import isNumber from './numeric'

const handleFormattedBalance = (balance, symbol, type) => {
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

export default handleFormattedBalance
