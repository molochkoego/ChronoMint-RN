/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { DUCK_MARKET } from 'redux/market/action'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import type BalancesCollection from 'models/tokens/BalancesCollection'
import type MainWalletModel from 'models/wallet/MainWalletModel'
import type TokensCollection from 'models/tokens/TokensCollection'

export const mainWalletStore = (state: any): MainWalletModel =>
  state.get(DUCK_MAIN_WALLET)

export const tokensStore = (state: any): TokensCollection =>
  state.get(DUCK_TOKENS)

export const getMainWalletBalancesCollection = (state: any): BalancesCollection =>
  state
    .get(DUCK_MAIN_WALLET)
    .balances()

export const getMainWalletBalancesListStore = (state: any): BalancesCollection =>
  getMainWalletBalancesCollection(state)
    .list()

export const selectedCurrencyStore = (state: any): string =>
  state
    .get(DUCK_MARKET)
    .selectedCurrency

export const pricesStore = (state: any) =>
  state
    .get(DUCK_MARKET)
    .prices