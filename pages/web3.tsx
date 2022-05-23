import {
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Fade,
  Typography,
  debounce,
} from '@mui/material';
import Container from '@mui/material/Container';
import { hooks, metaMask } from '../connectors/metaMask';
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
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

const Web3 = () => {
  const [balance, setBalance] = useAtom(balanceAtom);
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);
  const connectToChain = async () => {
    await metaMask.activate(43113);
  };

  useEffect(() => {
    if (accounts) {
      const SesameContract = new Contract(
        '0x6a6e2bB4C12373FB491aD4DEdb7D4c6491B6Be38',
        erc20abi,
        provider
      );
      SesameContract.balanceOf(accounts[0]).then((balance: any) => {
        setBalance(utils.formatEther(balance));
      });
    }
  }, [accounts]);
  const queryClient = useQueryClient();

  const { mutate, isLoading: isMutateLoading } = useMutation(
    async () => {
      if (!Array.isArray(accounts) || accounts?.length === 0) {
        throw new Error('No accounts found');
      }
      const fpReady = await fp.load();
      const fpResult = await fpReady.get();
      const sessionInit = await request(
        `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
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
      const result = await provider
        ?.getSigner()
        .signMessage(sessionInit.initSession.record.nonce);
      console.log(result);
      const confirmSession = await request(
        `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
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
          control={<Switch checked={isActive} disabled />}
          label={isActive ? 'Connected' : 'Disconnected'}
        />
        <Fade in={isActive}>
          <Stack display={isActive ? 'flex' : 'none'}>
            <Typography variant="h6" textAlign="center">
              {accounts && accounts[0]}
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
              loading={isActivating && !error && isActive}
            >
              Disconnect
            </LoadingButton>
          </Stack>
        </Fade>
        <Fade in={!isActive}>
          <LoadingButton
            loading={isActivating && !error && !isActive}
            onClick={connectToChain}
          >
            Connect
          </LoadingButton>
        </Fade>
      </Stack>
    </Container>
  );
};

export default Web3;
