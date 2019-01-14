/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  StyleSheet,
} from 'react-native'
import { headerHeight } from '../../../common/constants/screens'
import colors from '../../../common/colors'

export default StyleSheet.create({
  screenView: {
    flex: 1,
    marginTop: headerHeight,
    backgroundColor: colors.light,
    padding: 10,
  },
  lightGreyText: {
    color: colors.greySub,
  },
  transactionStatus: {
    padding: 10,
    alignItems: 'center',
  },
})
