import { Container, Typography } from "@mui/material";
import OrderPendingSkeleton from "../../components/OrderPendingSkeleton";
// import OrderPending from "../../components/OrderPending";
import { lazy, Suspense } from "react";
import request, { gql } from "graphql-request";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { ProductGraphQLQuery } from "../admin/product";

const OrderPending = lazy(() => import("../../components/OrderPending"));

const Order = () => {
  return (
    <Container>
      <Suspense fallback={<OrderPendingSkeleton />}>
        {/* @ts-ignore */}
        <OrderPending></OrderPending>
      </Suspense>
    </Container>
  );
};

export default Order;
