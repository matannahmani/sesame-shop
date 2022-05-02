import { Grid } from '@mui/material';
import request, { gql } from 'graphql-request';
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';
import { useQuery } from 'react-query';

const Devices = () => {
  const { status, data, error, isFetching } = useDevices();
  return (
    <Grid maxWidth="xl" container>
      <Grid item>
        <h1>Devices</h1>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'error' && <p>Error</p>}
        {status === 'success' && (
          <ul>
            {data.map(
              (device: {
                id: Key | null | undefined;
                name:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | ReactFragment
                  | ReactPortal
                  | null
                  | undefined;
              }) => (
                <li key={device.id}>{device.name}</li>
              )
            )}
          </ul>
        )}
      </Grid>
    </Grid>
  );
};

const useDevices = () => {
  return useQuery(['devices'], async () => {
    const { devices } = await request(
      '../api/graphql',
      gql`
        query {
          devices {
            id
            name
          }
        }
      `
    );

    return devices;
  });
};

export default Devices;
