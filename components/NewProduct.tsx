import { Drawer, Fab, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';
import {
  BooleanParam,
  StringParam,
  useQueryParam,
  NumberParam,
  useQueryParams,
  withDefault,
  ArrayParam,
} from 'use-query-params';
import { ChangeEvent, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQueryClient } from 'react-query';
import request, { gql } from 'graphql-request';

const NewProduct = () => {
  const [isOpen, setOpen] = useQueryParam('isOpen', BooleanParam);
  const [query, setQuery] = useQueryParams({
    name: StringParam,
    price: NumberParam,
    quantity: NumberParam,
    image: StringParam,
    description: StringParam,
  });
  const { name, price, quantity, image, description } = query;

  const onTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuery({ ...query, [e.target.id]: e.target.value });
  };
  const cleanQuery = () => {
    setQuery({ name: '', price: 0, quantity: 0, image: '', description: '' });
  };
  const queryClient = useQueryClient();

  const { isLoading, data, error, mutateAsync } = useMutation(
    async () => {
      const data = await request(
        'http://localhost:3000/api/graphql',
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
            ...query,
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
      onSuccess: () => {
        setTimeout(() => {
          closeDrawer();
        });
        cleanQuery();
        const productsData = queryClient.getQueryData('products');
        if (Array.isArray(productsData)) {
          queryClient.setQueryData('products', [...productsData, data]);
        } else {
          queryClient.setQueryData('products', [data]);
        }
        queryClient.invalidateQueries('products');
      },
    }
  );

  const closeDrawer = () => setOpen(false);
  return (
    <>
      <Drawer
        anchor={'left'}
        open={isOpen ? true : false}
        onClose={closeDrawer}
      >
        <Typography m="12px auto 2px auto" variant="h6">
          New Product
        </Typography>
        <Stack p={2} spacing={2}>
          <TextField
            defaultValue={name}
            id="name"
            onChange={onTextChange}
            label="Product Name"
          />
          <TextField
            defaultValue={price}
            type="number"
            id="price"
            onChange={onTextChange}
            label="Product Price"
          />
          <TextField
            defaultValue={quantity}
            type="number"
            id="quantity"
            onChange={onTextChange}
            label="Product Quantity"
          />
          <TextField
            defaultValue={description}
            id="description"
            onChange={onTextChange}
            minRows={5}
            label="Product Description"
            multiline
          />
          <TextField
            defaultValue={image}
            id="image"
            onChange={onTextChange}
            label="Product Image"
          />
        </Stack>
        <LoadingButton
          size="large"
          variant="contained"
          onClick={async () => await mutateAsync()}
          disabled={isLoading}
          loading={isLoading}
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
        onClick={() => setOpen(true)}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default NewProduct;
