import { Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { grey } from "../styles/colors";
import ShopItem from "./ShopItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

export interface IMarketGridCoin {
  image: string;
  price: number;
  title: string;
  desc: string;
}
[];

interface Props {
  marketData: IMarketGridCoin[];
}

const MarketGridCoin = ({ marketData }: Props) => {
  // const isSlide = useMediaQuery("(max-width:600px)");

  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {marketData.map((data) => (
        // it's simpler like this
        // P.S this component can also be splitten into two components
        // one for desktop and one for mobile (when slider is needed and when scrollbar is needed)
        <SwiperSlide style={{ maxWidth: 360 }}>
          <ShopItem {...data} key={data.title} />
        </SwiperSlide>
      ))}
      <Typography pt={1} fontSize={12} color={grey.middle_grey}>
        *본 상품은 한정 수량으로 조기 마감될 수 있습니다.
      </Typography>
    </Swiper>
  );
};

export default MarketGridCoin;
