import { Button, Container, Grid } from '@mui/material';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import { NumberParam, useQueryParam } from 'use-query-params';
import { GridColumns, DataGrid } from '@mui/x-data-grid';

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'price', headerName: 'Price', type: 'number', editable: true },
  { field: 'quantity', headerName: 'Quantity', editable: true },
  { field: 'description', headerName: 'Description', editable: true },
  { field: 'image', headerName: 'Image', editable: true },
];

const ProductPage = () => {
  const [page, setPage] = useQueryParam('page', NumberParam);
  const { data, isLoading } = useQuery(['products', page], async () => {
    const data = await request(
      'http://localhost:3000/api/graphql',
      gql`
        query Query {
          productMany {
            name
            price
            quantity
            description
            image
            _id
          }
        }
      `
    );
    return data;
  });
  useEffect(() => {
    console.log('data', data);
  }, [data]);
  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={12}>
          <h1>Product Page</h1>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <DataGrid
            rows={data?.productMany || []}
            columns={columns}
            getRowId={(row) => row._id}
            sx={{
              minHeight: '540px',
              maxWidth: 640,
            }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;
