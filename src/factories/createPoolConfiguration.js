// @flow

/* eslint-disable id-match */

import {
  parse as parseConnectionString,
} from 'pg-connection-string';
import type {
  ClientConfigurationType,
} from '../types';
import log from '../Logger';

export default (connectionUri: string, clientConfiguration: ClientConfigurationType) => {
  const poolConfiguration = parseConnectionString(connectionUri);

  poolConfiguration.connectionTimeoutMillis = clientConfiguration.connectionTimeout;
  poolConfiguration.idle_in_transaction_session_timeout = clientConfiguration.idleInTransactionSessionTimeout;
  poolConfiguration.idleTimeoutMillis = clientConfiguration.idleTimeout;
  poolConfiguration.max = clientConfiguration.maximumPoolSize;
  poolConfiguration.statement_timeout = clientConfiguration.statementTimeout;

  if (clientConfiguration.connectionTimeout === 'DISABLE_TIMEOUT') {
    poolConfiguration.connection_timeout = undefined;
  } else if (clientConfiguration.connectionTimeout === 0) {
    log.warn('connectionTimeout=0 sets timeout to 0 milliseconds; use connectionTimeout=DISABLE_TIMEOUT to disable timeout');

    poolConfiguration.connection_timeout = 1;
  }

  if (clientConfiguration.idleInTransactionSessionTimeout === 'DISABLE_TIMEOUT') {
    poolConfiguration.idle_in_transaction_session_timeout = undefined;
  } else if (clientConfiguration.idleInTransactionSessionTimeout === 0) {
    log.warn('idleInTransactionSessionTimeout=0 sets timeout to 0 milliseconds; use idleInTransactionSessionTimeout=DISABLE_TIMEOUT to disable timeout');

    poolConfiguration.idle_in_transaction_session_timeout = 1;
  }

  if (clientConfiguration.statementTimeout === 'DISABLE_TIMEOUT') {
    poolConfiguration.statement_timeout = undefined;
  } else if (clientConfiguration.statementTimeout === 0) {
    log.warn('statementTimeout=0 sets timeout to 0 milliseconds; use statementTimeout=DISABLE_TIMEOUT to disable timeout');

    poolConfiguration.statement_timeout = 1;
  }

  return poolConfiguration;
};