import { Skeleton, Typography } from '@mui/material';
import { grey } from '../styles/colors';
import ShopItem from './ShopItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useQuery } from 'react-query';
import { ProductGraphQLQuery } from '../pages/admin/product';
import request from 'graphql-request';
import { gql } from 'apollo-server-micro';

const MarketGridCoin = () => {
  // const isSlide = useMediaQuery("(max-width:600px)");
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
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {isLoading &&
        [...new Array(4)].map((_, index) => (
          <SwiperSlide key={`loading-slider-${index}`} style={{ width: 360 }}>
            <Skeleton variant="rectangular" width={320} height={200} />
          </SwiperSlide>
        ))}
      {data?.productMany.map((data) => (
        // it's simpler like this
        // P.S this component can also be splitten into two components
        // one for desktop and one for mobile (when slider is needed and when scrollbar is needed)
        <SwiperSlide key={`${data._id}`} style={{ maxWidth: 360 }}>
          <ShopItem {...data} />
        </SwiperSlide>
      ))}
      <Typography pt={1} fontSize={12} color={grey.middle_grey}>
        *본 상품은 한정 수량으로 조기 마감될 수 있습니다.
      </Typography>
    </Swiper>
  );
};

export default MarketGridCoin;
