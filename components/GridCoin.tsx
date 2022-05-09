import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import { orange } from "../styles/colors";

export interface IGridCoin {
  time: string;
  total_coin: number;
  image: string;
}

const GridCoin = ({ time, total_coin, image }: IGridCoin) => {
  return (
    <Box
      maxWidth={{ xs: 360 }}
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        color: orange.orange_brown,
        background: "#F9F9F9",
        borderRadius: "8px",
      }}
    >
      <Box px={2}>
        <Image src={image} alt={image} width={110} height={110} />
      </Box>
      <Box py={3} px={2}>
        <Typography> {time}</Typography>
        <Typography display="inline" fontSize={12}>
          {" "}
          Total
        </Typography>
        <Typography
          display="inline"
          sx={{ color: orange.keyring_orange, fontWeight: 700 }}
        >
          {" "}
          {total_coin}
        </Typography>
        <Typography display="inline"> SSC</Typography>
        <Button
          variant="contained"
          sx={{
            marginTop: 1,
            fontWeight: 700,
            borderRadius: 1,
            width: "100%",
          }}
        >
          Start
        </Button>
      </Box>
    </Box>
  );
};

export default GridCoin;
