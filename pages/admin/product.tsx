import { Button, CircularProgress, Container, Grid } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import {
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParam,
  useQueryParams,
} from 'use-query-params';
import { GridColumns, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import NewProduct, { ProductDrawer } from '../../components/NewProduct';
import { Box } from '@mui/system';
import ActionDialog from '../../components/ActionDialog';
import Product from '../../models/hyperledger/product';
import { Edit } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { drawerAtom } from '../../atoms/product';

export type ProductGraphQLQuery = Product[];

type ProductTableToolBar = {
  selection: string[];
  onClick: () => void;
  title: string;
};

const ProductTableToolBar = (props: ProductTableToolBar) => {
  if (props.selection.length === 0) return null;
  else
    return (
      <Box>
        <Button variant="contained" onClick={props.onClick} color="error">
          {props.title}
        </Button>
      </Box>
    );
};

const ProductPage = () => {
  const [drawer, setDrawer] = useAtom(drawerAtom);

  const { data, isLoading, refetch } = useQuery<ProductGraphQLQuery>(
    ['products', drawer.page],
    async () => {
      const data = await request(
        `/api/graphql`,
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
    }
  );

  const columns: GridColumns = [
    { field: 'name', headerName: 'Name' },
    { field: 'price', headerName: 'Price', type: 'number' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'description', headerName: 'Description' },
    { field: 'image', headerName: 'Image' },
    {
      field: '_id',
      headerName: 'Action',
      renderCell: (params: GridRenderCellParams<string>) => (
        <Button
          onClick={() => {
            setDrawer((prev) => ({
              ...prev,
              isOpen: true,
              isEditing: true,
              _id: `${params.id}`,
              isLoading: true,
            }));
          }}
        >
          Edit Product
        </Button>
      ),
    },
  ];

  const [actionDialogProps, setActionDialog] = useState({
    open: false,
    title: '',
  });

  const onClose = (success: boolean) => {
    setActionDialog({ open: false, title: '' });
    if (success) {
      // dialog was accepted
      mutate(selectionModel);
    }
  };

  const [selectionModel, setSelectionModel] = useState<string[]>([]);

  const { mutate, isLoading: isMutateLoading } = useMutation(
    async (ids: string[]) => {
      const data = await request(
        `/api/graphql`,
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
                in: ids,
              },
            },
          },
        },
        {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiX2lkIjoiNjI2ZjcxNTBkZGZlZGI3MDhmZjY5NjM4IiwiaWF0IjoxNTE2MjM5MDIyfQ.60XyJxf-8Sh6ENU68GUNQuc5fB76VPAVTAr1gzztOT4',
        }
      );
      return {
        deletedLength: data?.productRemoveMany?.numAffected,
        toDelete: ids,
      };
    },
    {
      onSuccess: (mutationData) => {
        // if (mutationData.deletedLength === mutationData.toDelete?.length) {
        //   const newData = data.filter(
        //     // @ts-ignore
        //     (p) => !mutationData.toDelete.includes(p._id)
        //   );
        //   queryClient.setQueryData(['products', page], newData);
        // }
        // queryClient.invalidateQueries(['products', page]);
        setSelectionModel([]);
        refetch();
      },
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
              rows={data || []}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel as string[]);
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
              disableSelectionOnClick
              componentsProps={{
                toolbar: {
                  selection: selectionModel,
                  title: `Delete ${selectionModel.length} products`,
                  onClick: () => {
                    setActionDialog({
                      open: true,
                      title: `Delete ${selectionModel.length} products?`,
                    });
                  },
                },
              }}
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
