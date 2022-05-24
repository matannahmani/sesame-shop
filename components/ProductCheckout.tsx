import {
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { grey, orange } from '../styles/colors';
import OrderSummary from './OrderSummary';
import request, { gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { ProductGraphQLQuery } from '../pages/admin/product';
import Product from '../models/hyperledger/product';

const ProductCheckout = () => {
  // TODO : change query to cart get data

  const { data, isLoading } = useQuery<ProductGraphQLQuery>(
    'cart/products',
    async () => {
      const data = await request(
        `/api/graphql`,
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
      return data.productMany;
    }
  );

  const total = data?.reduce((sum: number, current: Product) => {
    return sum + current.price;
  }, 0);

  return (
    <Box
      sx={{
        margin: 4,
        paddingTop: '64px',
        paddingBottom: '64px',
        maxWidth: '1236px',
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h6" mb={3}>
              Shipping information
            </Typography>
            <Box>
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Full name"
                      placeholder="Full name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Country"
                      placeholder="Country"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="City"
                      placeholder="City"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Adress"
                      placeholder="Adress"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Email"
                      placeholder="Email"
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" mb={3}>
            Order summary
          </Typography>
          <Paper variant="outlined">
            {data?.map((data, index) => (
              <OrderSummary key={index} {...data} />
            ))}
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography sx={{ px: '10px' }}>Order Total</Typography>
              <Typography
                display="inline"
                sx={{ color: grey.lightest_grey, px: '10px' }}
              >
                <span
                  style={{
                    fontSize: '1.4rem',
                    color: orange.keyring_orange,
                    fontWeight: 700,
                  }}
                >
                  {total}
                </span>{' '}
                SSC
              </Typography>
            </Box>
            {/* TODO : CHANGE ORDER ID */}
            <Link href={`/order/${'627891826859af2c3a619593'}`}>
              <Button
                variant="contained"
                sx={{
                  marginTop: 4,
                  padding: '15px',
                  fontWeight: 700,
                  borderRadius: 2,
                  width: '100%',
                  fontSize: '16px',
                }}
              >
                Complete order
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductCheckout;
