import { Grid, Typography, useMediaQuery } from "@mui/material";
import { grey } from "../styles/colors";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { Box } from "@mui/system";
import ShopItem from "./ShopItem";
// import useWindowSize, { Size } from "../utils/useWindowSize";

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
  const isSlide = useMediaQuery("(max-width:600px)");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 15,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={{ xs: "center", sm: "flex-start" }}
      maxWidth={{
        xs: 360,
      }}
    >
      <Box
        ref={sliderRef}
        maxWidth={{
          xs: 360,
          // sm: 600,
          // md: 960,
          // lg: 1280,
          // xl: 1920,
        }}
        sx={{ display: "flex", overflowX: "scroll" }}
        className={isSlide ? "keen-slider" : ""}
      >
        {marketData.map((data) => (
          // it's simpler like this
          // P.S this component can also be splitten into two components
          // one for desktop and one for mobile (when slider is needed and when scrollbar is needed)

          <ShopItem isSlide={isSlide} {...data} key={data.title} />
        ))}
      </Box>
      <Typography pt={1} fontSize={12} color={grey.middle_grey}>
        *본 상품은 한정 수량으로 조기 마감될 수 있습니다.
      </Typography>
      {loaded && instanceRef.current && isSlide && (
        <div className="dots">
          {[
            //@ts-ignore
            ...Array(instanceRef.current.track.details?.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={"dot" + (currentSlide === idx ? " active" : "")}
              ></button>
            );
          })}
        </div>
      )}
    </Box>
  );
};

export default MarketGridCoin;
