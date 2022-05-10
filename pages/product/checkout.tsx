import { Container } from "@mui/material";
import ProductCheckout from "../../components/ProductCheckout";

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

const ProductCheckoutPage = () => {
  return (
    <Container>
      <ProductCheckout {...data} />
    </Container>
  );
};

export default ProductCheckoutPage;
