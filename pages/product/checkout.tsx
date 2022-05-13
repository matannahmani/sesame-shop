import { Container } from '@mui/material';
import ProductCheckout from '../../components/ProductCheckout';
import { Types } from 'mongoose';

const ProductCheckoutPage = () => {
  return (
    <Container>
      <ProductCheckout
        _id={new Types.ObjectId('627891826859af2c3a619593')}
        name={''}
        price={0}
        quantity={0}
        description={''}
        image={''}
      />
    </Container>
  );
};

export default ProductCheckoutPage;
