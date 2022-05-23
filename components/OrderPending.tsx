import { CircularProgress, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import request, { gql } from 'graphql-request';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Product from '../models/hyperledger/product';
import { ProductGraphQLQuery } from '../pages/admin/product';
import OrderSummary from './OrderSummary';

const OrderPending = ({ name, description, price, image }: Product) => {
  // const router = useRouter();
  // const productId =
  //   typeof router.query?._id === 'string' ? router.query._id : '';

  // const { data, isLoading, isError, error } = useQuery<Product>(
  //   ['product/id', `${productId}`],
  //   () => getProductById(productId),
  //   { suspense: true }
  // );

  const { data, isLoading, refetch } = useQuery<ProductGraphQLQuery>(
    'products/market',
    async () => {
      const data = await request(
        `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
        gql`
          query Query {
            productMany {
              name
              price
              quantity
              description
              image
              _id
            }
          }
        `
      );
      return data;
    }
  );

  return (
    <Box
      sx={{
        margin: 4,
        paddingTop: '64px',
        paddingBottom: '64px',
        maxWidth: '1236px',
      }}
    >
      <Stack spacing={2} alignItems={'center'}>
        {data?.productMany.map((data, index) => (
          <OrderSummary key={index} {...data} />
        ))}
        <Typography variant="h6" marginRight={'10px'}>
          Order Status : Completed
        </Typography>
        {/* <CircularProgress color="success" /> */}
      </Stack>
    </Box>
  );
};

export default OrderPending;
