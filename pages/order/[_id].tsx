import { Button, Container, Typography } from '@mui/material';
import OrderPendingSkeleton from '../../components/OrderPendingSkeleton';
// import OrderPending from "../../components/OrderPending";
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

const OrderPending = lazy(() => import('../../components/OrderPending'));

const Order: React.FC = () => {
  const { reset } = useQueryErrorResetBoundary();
  console.log(reset);

  return (
    <Container>
      <ErrorBoundary
        onReset={() => console.log('test')}
        FallbackComponent={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        <Suspense fallback={<OrderPendingSkeleton />}>
          <OrderPending />
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
};

export default Order;
