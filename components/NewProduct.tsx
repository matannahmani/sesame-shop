import { Drawer, Fab, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQueryClient } from 'react-query';
import request, { gql } from 'graphql-request';
import { useAtom } from 'jotai';

import { drawerAtom, baseProductDrawerAtom } from '../atoms/product';
import { ProductGraphQLQuery } from '../pages/admin/product';
import { useSnackbar } from 'notistack';
import {
  useQueryParams,
  StringParam,
  NumberParam,
  useQueryParam,
  BooleanParam,
} from 'use-query-params';
export type ProductDrawer = {
  isEditing: boolean;
  id: string;
};

const ProductBaseState = {
  name: '',
  price: 0,
  quantity: 0,
  image: '',
  description: '',
};

const NewProduct = () => {
  const [drawer, setDrawer] = useAtom(drawerAtom);

  const [product, setProduct] = useState(ProductBaseState);
  const { enqueueSnackbar } = useSnackbar();

  const onTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (['quantity', 'price'].includes(e.target.id))
      setProduct((prev) => ({
        ...prev,
        [e.target.id]: Number(e.target.value),
      }));
    else setProduct((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const cleanQuery = () => {
    setProduct(ProductBaseState);
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    if (drawer.isOpen && drawer.isEditing && drawer._id) {
      const cachedData = queryClient.getQueryData<ProductGraphQLQuery>([
        'products',
        0,
      ]);
      if (cachedData) {
        const product = cachedData?.find(
          (product) => `${product._id}` === drawer._id
        );
        if (product) {
          setDrawer((prev) => ({
            ...prev,
            isOpen: true,
            isEditing: true,
            _id: `${product._id}`,
            isLoading: false,
          }));
          setProduct({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            description: product.description,
          });
          return;
        }
      }
      cleanQuery();
      setDrawer(baseProductDrawerAtom);
    }
  }, [drawer.isOpen, drawer.isEditing, drawer._id]);

  const { isLoading, mutateAsync } = useMutation(
    async () => {
      const data = await request(
        `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
        gql`
          mutation ProductCreateOne($record: CreateOneProductInput!) {
            productCreateOne(record: $record) {
              record {
                name
                price
                quantity
                description
                image
                _id
              }
            }
          }
        `,
        {
          record: {
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
            image: product.image,
          },
        },
        {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiX2lkIjoiNjI2ZjcxNTBkZGZlZGI3MDhmZjY5NjM4IiwiaWF0IjoxNTE2MjM5MDIyfQ.60XyJxf-8Sh6ENU68GUNQuc5fB76VPAVTAr1gzztOT4',
        }
      );
      return data?.productCreateOne?.record;
    },
    {
      onSuccess: (data) => {
        closeDrawer();
        enqueueSnackbar(`Product ${data?.name} created successfully`, {
          variant: 'success',
        });
        const productsData = queryClient.getQueryData('products');
        if (Array.isArray(productsData)) {
          queryClient.setQueryData('products', [...productsData, data]);
        } else {
          queryClient.setQueryData('products', [data]);
        }
        queryClient.invalidateQueries('products');
      },
      onError: (error) => {
        enqueueSnackbar(`Product creation failed: ${error}`, {
          variant: 'error',
        });
      },
    }
  );

  const { isLoading: patchLoading, mutateAsync: patchMutateAsync } =
    useMutation(
      async () => {
        const data = await request(
          `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
          gql`
            mutation ProductUpdateOne(
              $record: UpdateOneProductInput!
              $filter: FilterUpdateOneProductInput
            ) {
              productUpdateOne(record: $record, filter: $filter) {
                record {
                  name
                  price
                  quantity
                  description
                  image
                  _id
                  updatedAt
                  createdAt
                }
              }
            }
          `,
          {
            record: {
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              description: product.description,
              image: product.image,
            },
            filter: {
              _id: drawer._id,
            },
          },
          {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiX2lkIjoiNjI2ZjcxNTBkZGZlZGI3MDhmZjY5NjM4IiwiaWF0IjoxNTE2MjM5MDIyfQ.60XyJxf-8Sh6ENU68GUNQuc5fB76VPAVTAr1gzztOT4',
          }
        );
        return data?.productUpdateOne?.record;
      },
      {
        onSuccess: (data) => {
          closeDrawer();
          enqueueSnackbar(`Product ${data?.name} modifed successfully`, {
            variant: 'success',
          });
          const productsData = queryClient.getQueryData('products');
          if (Array.isArray(productsData)) {
            const optimisticData = productsData.map((product) =>
              product._id === data._id
                ? {
                    data,
                  }
                : product
            );
            queryClient.setQueryData('products', optimisticData);
          }
          queryClient.invalidateQueries('products');
        },
        onError: (error) => {
          enqueueSnackbar(`Error: ${error?.message}`, {
            variant: 'error',
          });
        },
      }
    );

  const closeDrawer = () => {
    setDrawer(baseProductDrawerAtom);
    cleanQuery();
  };

  return (
    <>
      <Drawer
        anchor={'left'}
        open={drawer.isOpen && !drawer.isLoading}
        onClose={closeDrawer}
      >
        <Typography m="12px auto 2px auto" variant="h6">
          New Product
        </Typography>
        <Stack p={2} spacing={2}>
          <TextField
            value={product.name}
            id="name"
            onChange={onTextChange}
            label="Product Name"
          />
          <TextField
            value={product.price}
            type="number"
            id="price"
            onChange={onTextChange}
            label="Product Price"
          />
          <TextField
            value={product.quantity}
            type="number"
            id="quantity"
            onChange={onTextChange}
            label="Product Quantity"
          />
          <TextField
            value={product.description}
            id="description"
            onChange={onTextChange}
            minRows={5}
            label="Product Description"
            multiline
          />
          <TextField
            value={product.image}
            id="image"
            onChange={onTextChange}
            label="Product Image"
          />
        </Stack>
        <LoadingButton
          size="large"
          variant="contained"
          onClick={async () =>
            drawer.isEditing ? await patchMutateAsync() : await mutateAsync()
          }
          disabled={isLoading || patchLoading}
          loading={isLoading || patchLoading}
          sx={{
            mt: 'auto',
            mb: '24px',
            mx: 'auto',
          }}
        >
          Save
        </LoadingButton>
      </Drawer>
      <Fab
        sx={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
        }}
        onClick={() =>
          setDrawer((prev) => ({
            ...prev,
            _id: '',
            isOpen: true,
            isEditing: false,
            isLoading: false,
          }))
        }
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default memo(NewProduct);
