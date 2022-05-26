import { Theme, useMediaQuery } from '@mui/material';
import { Contract, utils } from 'ethers';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from '../connectors/walletConnect';
import erc20abi from '../connectors/erc20abi.json';

const balanceAtom = atom('');

const ChainConnector = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  );
  const [balance, setBalance] = useAtom(balanceAtom);

  const mobileInfo = {
    accounts: walletConnectHooks.useAccounts(),
    account: walletConnectHooks.useAccount(),
    isActivating: walletConnectHooks.useIsActivating(),
    isActive: walletConnectHooks.useIsActive(),
    error: walletConnectHooks.useError(),
    provider: walletConnectHooks.useProvider(),
  };

  const desktopInfo = {
    accounts: metaMaskHooks.useAccounts(),
    account: metaMaskHooks.useAccount(),
    isActivating: metaMaskHooks.useIsActivating(),
    isActive: metaMaskHooks.useIsActive(),
    error: metaMaskHooks.useError(),
    provider: metaMaskHooks.useProvider(),
  };

  const info = isMobile ? mobileInfo : desktopInfo;

  useEffect(() => {
    if (info.account && info.isActive) {
      const SesameContract = new Contract(
        '0x6a6e2bB4C12373FB491aD4DEdb7D4c6491B6Be38',
        erc20abi,
        info.provider
      );
      SesameContract.balanceOf(info.account).then((balance: any) => {
        setBalance(utils.formatEther(balance));
      });
    }
  }, [info.account]);

  const disconnect = () => {
    walletConnect.deactivate();
    metaMask.deactivate();
  };

  useEffect(() => {
    void metaMask.connectEagerly();
    void walletConnect.connectEagerly();
  }, []);

  const connectToChain = async () => {
    console.log('connecting to chain');
    if (isMobile) {
      await walletConnect.activate();
    } else {
      await metaMask.activate(43113);
    }
  };
  return { connectToChain, info, balance, disconnect };
};

export default ChainConnector;
