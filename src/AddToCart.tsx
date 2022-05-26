import { gql } from 'apollo-server-micro';
import request from 'graphql-request';
import { useMutation } from 'react-query';
import { addToCartArgs } from '../models/hyperledger/users';

export const AddToCart = () => {
  const { mutate, isLoading: isMutateLoading } = useMutation(
    async ({ productId, prQuantity }: addToCartArgs) => {
      const data = await request(
        `/api/graphql`,
        gql`
          mutation AddToCart($productId: String!, $prQuantity: Float!) {
            addToCart(productId: $productId, prQuantity: $prQuantity) {
              cart {
                productId
              }
            }
          }
        `,
        {
          productId: productId,
          prQuantity: prQuantity,
        }
      );
    }
  );
  return { mutate, isLoading: isMutateLoading };
};

export default AddToCart;
