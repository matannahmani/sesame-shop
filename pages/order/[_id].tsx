import { Container, Typography } from '@mui/material';
import OrderPendingSkeleton from '../../components/OrderPendingSkeleton';
// import OrderPending from "../../components/OrderPending";
import { lazy, Suspense } from 'react';

const OrderPending = lazy(() => import('../../components/OrderPending'));

const Order = () => {
  return (
    <Container>
      <Suspense fallback={<OrderPendingSkeleton />}>
        <OrderPending />
      </Suspense>
    </Container>
  );
};

export default Order;
