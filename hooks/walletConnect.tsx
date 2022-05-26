import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  rpc: {
    43113: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  chainId: 43113,
});
const web3Provider = new providers.Web3Provider(provider);
provider.on('accountsChanged', (accounts: string[]) => {
  console.log(accounts);
});

// Subscribe to chainId change
provider.on('chainChanged', (chainId: number) => {
  console.log(chainId);
});

// Subscribe to session disconnection
provider.on('disconnect', (code: number, reason: string) => {
  console.log(code, reason);
});
const WalletConnectSDK = () => {
  const WalletConnectActivate = async () => {
    console.log('Trying to connect');
    await provider.enable();
  };

  return { WalletConnectActivate, web3Provider };
};

export default WalletConnectSDK;
