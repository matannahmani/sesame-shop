import Container from "@mui/material/Container";

import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { orange } from "../styles/colors";
import GridCoin from "../components/GridCoin";
import MarketGridCoin from "../components/MarketGridCoin";

const marketData = [
  {
    title: "스타벅스",
    desc: "아메리카노 Tall Size test wrap",
    price: 50.368,
    image: "/starbucks_americano.jpeg",
  },
  {
    title: "스타벅스스",
    desc: "아메리카노 Tall Size test wrap",
    price: 50.368,
    image: "/starbucks_americano.jpeg",
  },
  {
    title: "스타벅스스스",
    desc: "아메리카노 Tall Size test wrap",
    price: 50.368,
    image: "/starbucks_americano.jpeg",
  },
  {
    title: "꽃",
    desc: "Beautiful flower",
    price: 40.368222,
    image: "/꽃.jpeg",
  },
  {
    title: "꽃꽃",
    desc: "Beautiful flower",
    price: 40.368222,
    image: "/꽃.jpeg",
  },
  {
    title: "꽃꽃꽃",
    desc: "Beautiful flower",
    price: 40.368222,
    image: "/꽃.jpeg",
  },
];

const Home = () => {
  return (
    <Grid container spacing={3} padding={5} paddingX={4}>
      <Grid item xs={8}>
        <Typography variant="h5" fontWeight={700}>
          Hello, sesame !
        </Typography>
      </Grid>
      <Grid item xs={4} textAlign="right">
        <Button variant="outlined" sx={{ borderRadius: 30 }}>
          튜토리얼
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          참돌이와 함께 채굴을 시작해 보세요.
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          채굴은 원격으로 관리되고 있습니다.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <GridCoin
          time="00:00:00"
          total_coin={52.023}
          image="/gif_animation.png"
        />
        <Button
          sx={{ mt: 2, maxWidth: 360, borderRadius: 1 }}
          fullWidth
          variant="outlined"
        >
          친구 초대 당 +1 SSC 무제한 지급
        </Button>
      </Grid>
      <Grid item xs={12} mt={3}>
        <Box
          width={11}
          height={5}
          sx={{ backgroundColor: orange.keyring_orange }}
        />
        <Typography variant="h6" fontWeight={700}>
          Sesame 마켓
        </Typography>
        <Typography variant="h6" fontSize={14}>
          다음 업데이트될 상품도 기대해 주세요!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <MarketGridCoin marketData={marketData}></MarketGridCoin>
      </Grid>
    </Grid>
  );
};

export default Home;
