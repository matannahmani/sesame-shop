import { Container, Typography } from '@mui/material';
import { dehydrate, QueryClient, useQuery, useQueryClient } from 'react-query';
import { GetStaticPaths, GetStaticProps } from 'next';
import ProductItem from '../../components/ProductItem';
import request, { gql } from 'graphql-request';
import { ProductGraphQLQuery } from '../admin/product';
import { useRouter } from 'next/router';

const ProductDetailsPage = () => {
  const router = useRouter();
  const productId =
    typeof router.query?._id === 'string' ? router.query._id : '';

  const { data, isLoading, isError, error } = useQuery<ProductGraphQLQuery>(
    ['product/id', `${productId}`],
    () => getProductById(productId)
  );

  // const queryClient = useQueryClient();
  // console.log(queryClient.getQueryData('user/id'));

  return (
    <Container maxWidth="xl">
      {/* @ts-ignore */}
      <ProductItem {...data} />
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const productIds = await getProductIds();
  const mappedIds = productIds.map((i) => ({
    params: {
      _id: i._id,
    },
  }));

  return {
    paths: mappedIds,
    fallback: 'blocking',
  };
};

type ProductPageParams = {
  _id: string;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const params = ctx.params as ProductPageParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['product/id', `${params._id}`], () =>
    getProductById(`${params._id}`)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 600,
  };
};

type productIds = {
  _id: string;
}[];

const getProductIds = async () => {
  try {
    const data = await request(
      '/api/graphql',
      gql`
        query ProductMany($limit: Int) {
          productMany(limit: $limit) {
            _id
          }
        }
      `
    );
    return data.productMany as productIds;
  } catch (err) {
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const data = await request(
      `/api/graphql`,
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
    if (data?.productById === null) {
      throw new Error('Product not found');
    }
    return data.productById;
  } catch (err) {
    return null;
  }
};

export default ProductDetailsPage;
