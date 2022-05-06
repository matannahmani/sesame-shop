import { Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { orange, grey } from "../styles/colors";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import "keen-slider/keen-slider.min.css";

interface IMarketGridCoin {
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
            <div ref={sliderRef} className="keen-slider">
                {marketData.map((data) => (
                    <div className="keen-slider__slide" key={data.title}>
                        <Grid
                            container
                            p={2}
                            sx={{
                                borderRadius: "15px",
                                boxShadow:
                                    "2px 2px 16px rgba(125, 98, 86, 0.1)",
                                background: "#FFFFFF",
                                fontSize: "14px",
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
                            <Grid item container xs={6}>
                                <Grid item xs={12}>
                                    <Typography> {data.title}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            overflow: "hidden",
                                            width: "140px",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {" "}
                                        {data.desc}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    style={{
                                        marginTop: "0.3rem",
                                    }}
                                >
                                    <Typography
                                        display="inline"
                                        style={{
                                            marginTop: "10rem",
                                            color: orange.keyring_orange,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {data.price}
                                    </Typography>
                                    <Typography display="inline">
                                        {" "}
                                        SSC
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            marginTop: "0.8rem",
                                            fontWeight: "700",
                                            borderRadius: "100px",
                                            width: "100%",
                                        }}
                                    >
                                        교환하기
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container pt={1}>
                            <Grid item xs={12}>
                                <Typography
                                    fontSize={12}
                                    style={{ color: grey.middle_grey }}
                                >
                                    *본 상품은 한정 수량으로 조기 마감될 수
                                    있습니다.
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                ))}
            </div>
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
                                className={
                                    "dot" +
                                    (currentSlide === idx ? " active" : "")
                                }
                            ></button>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default MarketGridCoin;
