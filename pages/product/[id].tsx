import { Container } from "@mui/material";
import ProductItem from "../../components/ProductItem";

const data = {
  name: "스타벅스",
  description: "아메리카노 Tall Size",
  price: 50.368,
  image: "/starbucks_americano.jpeg",
  // _id: "",
  // createdAt: "",
  // quantity: "",
  // updatedAt: "",
};

//GraphQL query to get the product based on id ?

const ProductDetailsPage = () => {
  return (
    <Container>
      <ProductItem {...data} />
    </Container>
  );
};

export default ProductDetailsPage;
