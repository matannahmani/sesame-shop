import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';

// @ts-ignore
export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: {
        43113: 'https://api.avax-test.network/ext/bc/C/rpc',
      },
    }),
  [43113]
);