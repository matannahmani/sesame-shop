import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ChainConnector from '../hooks/ChainConnector';
import Product from '../models/hyperledger/product';
import { grey, orange } from '../styles/colors';
import AddToCart from '../src/AddToCart';
import { Contract, utils } from 'ethers';

const ProductItem = ({ _id, name, description, price, image }: Product) => {
  const { connectToChain, disconnect, info, balance, smartContract, erc20abi } =
    ChainConnector();
  const mutation = AddToCart();

  const AddToCartOrLogin = () => {
    if (!info.isActive) {
      return connectToChain();
    }
    mutation.mutate({
      productId: `${_id}`,
      prQuantity: 1,
    });
  };

  const PurchaseOrLogin = async () => {
    if (!info.isActive) {
      return connectToChain();
    }
    const SesameContract = new Contract(
      '0x6a6e2bB4C12373FB491aD4DEdb7D4c6491B6Be38',
      erc20abi,
      info.provider
    );
    await SesameContract.transfer(info.account, utils.parseEther('5'));
  };

  return (
    <Box
      sx={{
        margin: 4,
        paddingTop: '64px',
        paddingBottom: '64px',
        maxWidth: '1236px',
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={7}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              height: { xs: '200px', md: '100%' },
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {image ? (
              <Image
                src={image}
                alt={image}
                priority
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <Skeleton variant="rectangular" width={320} height={300} />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
            <Typography sx={{ color: grey.lightest_grey }}>
              <span
                style={{
                  fontSize: '2rem',
                  color: orange.keyring_orange,
                  fontWeight: 700,
                }}
              >
                {price}
              </span>{' '}
              SSC
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ color: grey.middle_grey }}>
            {description}
          </Typography>
          <Button
            onClick={PurchaseOrLogin}
            variant="contained"
            sx={{
              marginTop: 4,
              // margin: "16px 0px 0px 16px",
              padding: '15px',
              fontWeight: 700,
              borderRadius: 2,
              width: '100%',
              fontSize: '16px',
            }}
          >
            BUY
          </Button>
          <Button
            variant="outlined"
            onClick={AddToCartOrLogin}
            sx={{
              marginTop: 4,
              // margin: "16px 0px 0px 16px",
              padding: '15px',
              fontWeight: 700,
              borderRadius: 2,
              width: '100%',
              fontSize: '16px',
            }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductItem;
