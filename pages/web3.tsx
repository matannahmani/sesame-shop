import {
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Fade,
  Typography,
  debounce,
  useMediaQuery,
  Theme,
} from '@mui/material';
import Container from '@mui/material/Container';
import { hooks, walletConnect } from '../connectors/walletConnect';
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import request, { gql } from 'graphql-request';
import fp from '@fingerprintjs/fingerprintjs';
import { Contract, utils } from 'ethers';
import erc20abi from '../connectors/erc20abi.json';
import { atom, useAtom } from 'jotai';

const balanceAtom = atom('');

const {
  useENSNames,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
} = metaMaskHooks;

const Web3 = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  );
  const [balance, setBalance] = useAtom(balanceAtom);
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  const mobileInfo = {
    accounts: hooks.useAccounts(),
    isActivating: hooks.useIsActivating(),
    isActive: hooks.useIsActive(),
    error: hooks.useError(),
    provider: hooks.useProvider(),
  };

  useEffect(() => {
    // void metaMask.connectEagerly(e);
  }, []);

  const connectToChain = async () => {
    if (isMobile) {
      await walletConnect.activate();
    } else {
      console.log('connecting to chain');
      await metaMask.activate(43113);
    }
  };

  useEffect(() => {
    if (!isMobile && accounts && isActive) {
      const SesameContract = new Contract(
        '0x6a6e2bB4C12373FB491aD4DEdb7D4c6491B6Be38',
        erc20abi,
        provider
      );
      SesameContract.balanceOf(accounts[0]).then((balance: any) => {
        setBalance(utils.formatEther(balance));
      });
    } else if (isMobile && mobileInfo.accounts && mobileInfo.isActive) {
      const SesameContract = new Contract(
        '0x6a6e2bB4C12373FB491aD4DEdb7D4c6491B6Be38',
        erc20abi,
        mobileInfo.provider
      );
      SesameContract.balanceOf(mobileInfo.accounts[0]).then((balance: any) => {
        setBalance(utils.formatEther(balance));
      });
    }
  }, [accounts]);

  const isConnecting = isMobile ? isActivating : mobileInfo.isActivating;
  const globalIsActive = isMobile ? isActive : mobileInfo.isActive;
  const globalProvider = isMobile ? provider : mobileInfo.provider;
  const globalAccounts = isMobile ? accounts : mobileInfo.accounts;
  const queryClient = useQueryClient();

  const { mutate, isLoading: isMutateLoading } = useMutation(
    async () => {
      if (!Array.isArray(accounts) || accounts?.length === 0) {
        throw new Error('No accounts found');
      }
      const fpReady = await fp.load();
      const fpResult = await fpReady.get();
      const sessionInit = await request(
        `/api/graphql`,
        gql`
          mutation InitSession($record: CreateOneSessionInput!) {
            initSession(record: $record) {
              recordId
              record {
                nonce
              }
            }
          }
        `,
        {
          record: {
            fp: fpResult.visitorId,
            address: accounts[0],
          },
        }
      );
      const result = await globalProvider
        ?.getSigner()
        .signMessage(sessionInit.initSession.record.nonce);
      console.log(result);
      const confirmSession = await request(
        `/api/graphql`,
        gql`
          mutation ConfirmSession($secret: String!, $address: String!) {
            confirmSession(secret: $secret, address: $address) {
              address
              fp
              _id
            }
          }
        `,
        {
          secret: result,
          address: accounts[0],
        }
      );
      return confirmSession.confirmSession;
    },
    {
      onSuccess: (mutationData) => {
        queryClient.setQueryData('user', {
          ...mutationData,
        });
      },
    }
  );

  return (
    <Container maxWidth="xl">
      <Stack mt={8}>
        <FormControlLabel
          sx={{ m: 'auto' }}
          control={<Switch checked={globalIsActive} disabled />}
          label={globalIsActive ? 'Connected' : 'Disconnected'}
        />
        <Fade in={globalIsActive}>
          <Stack display={globalIsActive ? 'flex' : 'none'}>
            <Typography variant="h6" textAlign="center">
              {globalAccounts && globalAccounts[0]}
            </Typography>
            <Typography variant="h6" textAlign="center">
              Balance: {balance}
            </Typography>
            <Typography variant="h6" textAlign="center"></Typography>
            <LoadingButton
              loading={Boolean(isMutateLoading)}
              onClick={() => mutate()}
            >
              Login
            </LoadingButton>
            <LoadingButton
              onClick={() => metaMask.deactivate()}
              loading={globalIsActive}
            >
              Disconnect
            </LoadingButton>
          </Stack>
        </Fade>
        <Fade in={!globalIsActive}>
          <LoadingButton loading={isConnecting} onClick={connectToChain}>
            Connect
          </LoadingButton>
        </Fade>
      </Stack>
    </Container>
  );
};

export default Web3;
