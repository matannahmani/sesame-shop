import { Container } from '@mui/material';
import useGuardCheckUserId from '../../components/GuardCheckUserId';
import ProductCheckout from '../../components/ProductCheckout';

const ProductCheckoutPage = () => {
  const { loading, component } = useGuardCheckUserId();
  if (loading) return component;
  return (
    <Container maxWidth="xl">
      <ProductCheckout />
    </Container>
  );
};

export default ProductCheckoutPage;
