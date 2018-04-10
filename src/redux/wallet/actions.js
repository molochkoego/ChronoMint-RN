// @flow

import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { DUCK_MULTISIG_WALLET, selectMultisigWallet } from 'redux/multisigWallet/actions'

export const DUCK_WALLET = 'wallet'

export const WALLET_SWITCH_WALLET = 'WALLET/switch_wallet'

export const switchWallet = (wallet, address, token) => (dispatch) => {
  const isMultisig = wallet.isMultisig()
  dispatch({ type: WALLET_SWITCH_WALLET, isMultisig, address, token })
  if (isMultisig) {
    dispatch(selectMultisigWallet(wallet.id()))
  }
}

// TODO @ipavlenko: Move to ./selectors.js
export const getCurrentWallet = (state) => {
  const { isMultisig } = state.get(DUCK_WALLET)

  return isMultisig
    ? state.get(DUCK_MULTISIG_WALLET).selected()
    : state.get(DUCK_MAIN_WALLET)
}
