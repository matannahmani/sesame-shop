import { Grid, Typography, Button } from '@mui/material';
import { orange, grey } from '../styles/colors';
import { IMarketGridCoin } from './MarketGridCoin';
import { Box } from '@mui/system';

type isSlide = {
  isSlide: boolean;
};

const ShopItem = ({
  title,
  desc,
  price,
  isSlide,
}: IMarketGridCoin & isSlide) => (
  <Box
    className={isSlide ? 'keen-slider__slide' : ''}
    display="flex"
    flexDirection="column"
    maxWidth={360}
    sx={{
      borderRadius: '15px',
      boxShadow: '2px 2px 16px rgba(125, 98, 86, 0.1)',
      background: '#FFFFFF',
      fontSize: '14px',
      color: grey.darkest_grey,
    }}
  >
    {/* you can possible use grid or box here but try to make this as reusable component.
      Where you can use on mobile (when slider is needed)
        and on desktop (when slider is not needed) (e.g. scrollbar)
      */}
    <Typography variant="h5" fontWeight={700}>
      {title}
    </Typography>
    <Typography
      style={{
        overflow: 'hidden',
        width: '140px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      {' '}
      {desc}
    </Typography>
  </Box>
);

/* OLD CODE BASE

  <Grid item container xs={6}>
    <Grid item xs={12}>
      <Typography> {title}</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography
        style={{
          overflow: 'hidden',
          width: '140px',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {' '}
        {desc}
      </Typography>
    </Grid>
    <Grid
      item
      xs={12}
      style={{
        marginTop: '0.3rem',
      }}
    >
      <Typography
        display="inline"
        style={{
          marginTop: '10rem',
          color: orange.keyring_orange,
          fontWeight: '700',
        }}
      >
        {price}
      </Typography>
      <Typography display="inline"> SSC</Typography>
    </Grid>
    <Grid item xs={12}>
      <Button
        variant="contained"
        style={{
          marginTop: '0.8rem',
          fontWeight: '700',
          borderRadius: '100px',
          width: '100%',
        }}
      >
        교환하기
      </Button>
    </Grid>
  </Grid>
                  <Grid
                  container
                  p={2}
                  maxWidth={360}
                  sx={{
                    borderRadius: '15px',
                    boxShadow: '2px 2px 16px rgba(125, 98, 86, 0.1)',
                    background: '#FFFFFF',
                    fontSize: '14px',
                    color: grey.darkest_grey,
                  }}
                >
                  <Grid item container xs={6} paddingRight={2}>
                    <Image
                      src={data.image}
                      alt={data.image}
                      width={155}
                      height={155}
                    />
                  </Grid>
                </Grid>
                <Grid container pt={1}>
                  <Grid item xs={12}>
                    <Typography
                      fontSize={12}
                      style={{ color: grey.middle_grey }}
                    >
                      *본 상품은 한정 수량으로 조기 마감될 수 있습니다.
                    </Typography>
                  </Grid>
                </Grid>

*/
export default ShopItem;
