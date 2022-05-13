import { CircularProgress, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import request, { gql } from "graphql-request";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Product from "../models/hyperledger/product";
import { ProductGraphQLQuery } from "../pages/admin/product";

const data = {
  name: "스타벅스",
  description: "아메리카노 Tall Size",
  price: 50.368,
  image: "/starbucks_americano.jpeg",
  createdAt: new Date(),
  quantity: 0,
  updatedAt: new Date(),
};

const OrderPending = ({ name, image, _id }: Product) => {
  const router = useRouter();
  const productId =
    typeof router.query?._id === "string" ? router.query._id : "";

  console.log(router.query?._id);

  const { data, isLoading, isError, error } = useQuery<ProductGraphQLQuery>(
    ["product/id", `${productId}`],
    () => getProductById(productId),
    { suspense: true }
  );
  return (
    <Box
      sx={{
        margin: 4,
        paddingTop: "64px",
        paddingBottom: "64px",
        maxWidth: "1236px",
      }}
    >
      <Stack spacing={2} alignItems={"center"}>
        <Typography variant="h2">{data?.productById.name}</Typography>
        <img
          src={data?.productById.image}
          alt={data?.productById.image}
          width={200}
          height={"100%"}
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
        <Typography variant="h6" marginRight={"10px"}>
          Status : Order completed
        </Typography>
        <CircularProgress color="success" />
      </Stack>
    </Box>
  );
};

const getProductById = async (id: string) => {
  const data = await request(
    `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
    gql`
      query ProductById($id: MongoID!) {
        productById(_id: $id) {
          name
          price
          quantity
          description
          image
          _id
        }
      }
    `,
    {
      id: id,
    }
  );
  return data;
};

export default OrderPending;
