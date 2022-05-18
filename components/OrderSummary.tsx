import { Box, Typography, Divider, Skeleton } from '@mui/material';
import { grey, orange } from '../styles/colors';
import Product from '../models/hyperledger/product';
import Image from 'next/image';

const OrderSummary = ({ name, image, price }: Product) => {
  return (
    <Box>
      <Box display={'flex'} sx={{ marginTop: '20px' }}>
        <Box
          sx={{
            position: 'relative',
            // height: '120px',
            width: '120px',
            marginRight: '16px',
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
            <Skeleton variant="rectangular" width={120} height={120} />
          )}
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'flex-start'}
          flexDirection="column"
        >
          <Box>
            <Typography variant="subtitle1">{name}</Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: grey.lightest_grey,
              }}
            >
              <span
                style={{
                  fontSize: '1rem',
                  color: orange.keyring_orange,
                  fontWeight: 700,
                }}
              >
                {price}
              </span>{' '}
              SSC
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider
        // sx={{ borderColor: 'rgba(255, 255, 255, 0.45)' }}
        style={{ margin: '24px 0px 24px 0px' }}
      />
    </Box>
  );
};

export default OrderSummary;
