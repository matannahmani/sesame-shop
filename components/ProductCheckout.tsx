import {
  Button,
  Divider,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import Product from "../models/hyperledger/product";
import { grey, orange } from "../styles/colors";

//Test data
const cart = [
  {
    name: "스타벅스스스",
    desc: "아메리카노 Tall Size test wrap",
    price: 50.368,
    image: "/starbucks_americano.jpeg",
  },
  {
    name: "꽃",
    desc: "Beautiful flower",
    price: 40.368222,
    image: "/꽃.jpeg",
  },
  {
    name: "꽃꽃",
    desc: "Beautiful flower",
    price: 40.368222,
    image: "/꽃.jpeg",
  },
];

const ProductCheckout = ({
  name,
  description,
  price,
  image,
  //@ts-ignore
  _id = "627891826859af2c3a619593",
}: Product) => {
  return (
    <Box
      sx={{
        margin: 4,
        paddingTop: "64px",
        paddingBottom: "64px",
        maxWidth: "1236px",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h6" mb={3}>
              Shipping information
            </Typography>
            <Box>
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Full name"
                      placeholder="Full name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Country"
                      placeholder="Country"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="City"
                      placeholder="City"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Adress"
                      placeholder="Adress"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="outlined-required"
                      label="Email"
                      placeholder="Email"
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" mb={3}>
            Order summary
          </Typography>
          <Paper variant="outlined">
            {cart.map((data) => (
              <Box key={data.name}>
                <Box display={"flex"}>
                  <img
                    src={data.image}
                    alt={data.image}
                    width={"100%"}
                    height={"100%"}
                    style={{
                      borderRadius: "8px",
                      maxWidth: "120px",
                      marginRight: "16px",
                    }}
                  />

                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                    flexDirection="column"
                  >
                    <Box>
                      <Typography variant="subtitle1">{data.name}</Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: grey.lightest_grey,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1rem",
                            color: orange.keyring_orange,
                            fontWeight: 700,
                          }}
                        >
                          {data.price}
                        </span>{" "}
                        SSC
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider
                  sx={{ borderColor: "rgba(255, 255, 255, 0.45)" }}
                  style={{ margin: "24px 0px 24px 0px" }}
                />
              </Box>
            ))}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Order Total</Typography>
              <Typography display="inline" sx={{ color: grey.lightest_grey }}>
                <span
                  style={{
                    fontSize: "1.4rem",
                    color: orange.keyring_orange,
                    fontWeight: 700,
                  }}
                >
                  {/* {price} */}
                  40000
                </span>{" "}
                SSC
              </Typography>
            </Box>
            <Link href={`/order/${_id}`}>
              <Button
                variant="contained"
                sx={{
                  marginTop: 4,
                  padding: "15px",
                  fontWeight: 700,
                  borderRadius: 2,
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                Complete order
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductCheckout;
