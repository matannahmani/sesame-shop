import { Button, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { orange } from "../styles/colors";

export interface IGridCoin {
    time: string;
    total_coin: number;
    image: string;
}

const GridCoin = ({ time, total_coin, image }: IGridCoin) => {
    return (
        <Grid
            container
            p={2}
            sx={{
                color: orange.orange_brown,
                background: "#F9F9F9",
                borderRadius: "8px",
            }}
        >
            <Grid item xs={4} paddingRight={2}>
                <Image src={image} alt={image} width={110} height={110} />
            </Grid>
            <Grid item container xs={8}>
                <Grid item xs={12}>
                    <Typography> {time}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography display="inline" style={{ fontSize: "12px" }}>
                        {" "}
                        Total
                    </Typography>
                    <Typography
                        display="inline"
                        style={{
                            color: orange.keyring_orange,
                            fontWeight: "700",
                        }}
                    >
                        {" "}
                        {total_coin}
                    </Typography>
                    <Typography display="inline"> SSC</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        style={{
                            fontWeight: "700",
                            borderRadius: "6px",
                            width: "100%",
                        }}
                    >
                        Start
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default GridCoin;
