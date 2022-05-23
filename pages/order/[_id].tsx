import { Container } from '@mui/material';
import OrderPendingSkeleton from '../../components/OrderPendingSkeleton';
import OrderPending from '../../components/OrderPending';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { getProductById } from '../product/[_id]';
import { ProductGraphQLQuery } from '../admin/product';

const Order = () => {
  const router = useRouter();
  const productId =
    typeof router.query?._id === 'string' ? router.query._id : '';

  //TODO : Change fetch function to get cart products
  const { data, isLoading, isError } = useQuery<ProductGraphQLQuery>(
    ['order/id', `${productId}`],
    () => getProductById(productId)
  );

  if (isError) {
    router.replace('/404');
  }

  return (
    <Container maxWidth="xl">
      {isLoading ? (
        <OrderPendingSkeleton />
      ) : (
        // @ts-ignore
        <OrderPending {...data} />
      )}
    </Container>
  );
};

export default Order;
