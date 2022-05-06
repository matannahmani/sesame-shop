import { Button, CircularProgress, Container, Grid } from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import { NumberParam, useQueryParam } from 'use-query-params';
import { GridColumns, DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import NewProduct from '../../components/NewProduct';
import { Box } from '@mui/system';
import ActionDialog from '../../components/ActionDialog';

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', editable: true },
  { field: 'price', headerName: 'Price', type: 'number', editable: true },
  { field: 'quantity', headerName: 'Quantity', editable: true },
  { field: 'description', headerName: 'Description', editable: true },
  { field: 'image', headerName: 'Image', editable: true },
];

type ProductTableToolBar = { selection: string[]; onClick: () => void };

const ProductTableToolBar = (props: ProductTableToolBar) => {
  if (props.selection.length === 0) return null;
  else
    return (
      <Box>
        <Button variant="contained" onClick={props.onClick} color="error">
          Delete All
        </Button>
      </Box>
    );
};

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

  const [actionDialogProps, setActionDialog] = useState({
    open: false,
    title: '',
  });

  const onClose = (success: boolean) => {
    setActionDialog({ open: false, title: '' });
  };

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const { mutate, isLoading: isMutateLoading } = useMutation(
    async (ids: string[]) => {
      console.log(ids);
      const data = await request(
        'http://localhost:3000/api/graphql',
        gql`
          mutation ProductRemoveMany($filter: FilterRemoveManyProduct_f) {
            productRemoveMany(filter: $filter) {
              numAffected
            }
          }
        `,
        {
          filter: {
            _operators: {
              _id: {
                in: null,
              },
            },
          },
        }
      );

      return data;
    }
  );

  return (
    <>
      <Container maxWidth="xl">
        <Grid container>
          <Grid item xs={12}>
            <h1>Product Page</h1>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <DataGrid
              loading={isLoading}
              rows={data?.productMany || []}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
              getRowId={(row) => row._id}
              sx={{
                minHeight: '540px',
                maxWidth: 640,
              }}
              components={{
                Toolbar: ProductTableToolBar,
              }}
              componentsProps={{
                toolbar: {
                  selection: selectionModel,
                  onClick: () => {
                    setActionDialog({
                      open: true,
                      title: `Delete ${selectionModel.length} products?`,
                    });
                  },
                },
              }}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Grid>
        </Grid>
      </Container>
      <ActionDialog
        open={actionDialogProps.open}
        title={actionDialogProps.title}
        onClose={onClose}
      />
      <NewProduct />
    </>
  );
};

export default ProductPage;
