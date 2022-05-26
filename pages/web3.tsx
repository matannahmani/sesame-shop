import {
  Stack,
  Switch,
  FormControlLabel,
  Fade,
  Typography,
} from '@mui/material';
import Container from '@mui/material/Container';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import request, { gql } from 'graphql-request';
import fp from '@fingerprintjs/fingerprintjs';
import ChainConnector from '../hooks/ChainConnector';

const Web3 = () => {
  const { connectToChain, disconnect, info, balance } = ChainConnector();
  const queryClient = useQueryClient();

  const { mutate, isLoading: isMutateLoading } = useMutation(
    async () => {
      console.log(info);
      if (!info.isActive || !info.account) {
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
            address: info.account,
          },
        }
      );
      const result = await info.provider
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
          address: info.account,
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
          control={<Switch checked={info.isActive} disabled />}
          label={info.isActive ? 'Connected' : 'Disconnected'}
        />
        <Fade in={info.isActive}>
          <Stack display={info.isActive ? 'flex' : 'none'}>
            <Typography variant="h6" textAlign="center">
              {info.account}
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
            <LoadingButton onClick={disconnect} loading={info.isActivating}>
              Disconnect
            </LoadingButton>
          </Stack>
        </Fade>
        <Fade in={!info.isActive}>
          <LoadingButton loading={info.isActivating} onClick={connectToChain}>
            Connect
          </LoadingButton>
        </Fade>
      </Stack>
    </Container>
  );
};

export default Web3;
