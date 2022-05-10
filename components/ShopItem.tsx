import { Grid, Typography, Button } from "@mui/material";
import { orange, grey } from "../styles/colors";
import { Box } from "@mui/system";
import Image from "next/image";
import Product from "../models/hyperledger/product";
import Link from "next/link";

const ShopItem = ({ name, description, price, image, _id }: Product) => (
  <>
    <Box
      display="flex"
      alignItems={"center"}
      maxWidth={360}
      sx={{
        borderRadius: "15px",
        boxShadow: "2px 2px 16px rgba(125, 98, 86, 0.1)",
        background: "#FFFFFF",
        fontSize: "14px",
        color: grey.darkest_grey,
      }}
    >
      {/* you can possible use grid or box here but try to make this as reusable component.
      Where you can use on mobile (when slider is needed)
        and on desktop (when slider is not needed) (e.g. scrollbar)
      */}
      <Box px={2}>
        <Image src={image} alt={image} width={155} height={155} />
      </Box>
      <Box py={3} px={2}>
        <Typography variant="h5" fontWeight={700}>
          {name}
        </Typography>
        <Typography
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: 150,
            whiteSpace: "nowrap",
            paddingBottom: 0.6,
          }}
        >
          {" "}
          {description}
        </Typography>
        <Typography
          display="inline"
          sx={{ color: orange.keyring_orange, fontWeight: 700 }}
        >
          {price}
        </Typography>
        <Typography display="inline"> SSC</Typography>
        <Link href={`/product/${_id}`}>
          <Button
            variant="contained"
            sx={{
              marginTop: 1,
              fontWeight: 700,
              borderRadius: 100,
              width: "100%",
            }}
          >
            교환하기
          </Button>
        </Link>
      </Box>
    </Box>
  </>
);

export default ShopItem;
