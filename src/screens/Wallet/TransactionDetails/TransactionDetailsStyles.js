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
    padding: 20,
  },
  lightGreyText: {
    color: colors.greySub,
  },
  statusLabel: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
  transactionStatus: {
    padding: 10,
    flexShrink: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  transactionProgress: {
    flexShrink: 1,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
