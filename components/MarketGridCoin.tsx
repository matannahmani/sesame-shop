import { Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { orange, grey } from '../styles/colors';
import { useKeenSlider } from 'keen-slider/react';
import { useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { Box } from '@mui/system';
import ShopItem from './ShopItem';

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
    <>
      <Grid
        container
        maxWidth={{
          xs: 360,
        }}
      >
        <Grid item xs={12}>
          <Box
            ref={sliderRef}
            maxWidth={{
              xs: 360,
            }}
            className="keen-slider"
          >
            {marketData.map((data) => (
              // it's simpler like this
              // P.S this component can also be splitten into two components
              // one for desktop and one for mobile (when slider is needed and when scrollbar is needed)

              <ShopItem isSlide={true} {...data} key={data.title} />
            ))}
          </Box>
          {loaded && instanceRef.current && (
            <div className="dots">
              {[
                //@ts-ignore
                ...Array(
                  instanceRef.current.track.details.slides.length
                ).keys(),
              ].map((idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={'dot' + (currentSlide === idx ? ' active' : '')}
                  ></button>
                );
              })}
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MarketGridCoin;
