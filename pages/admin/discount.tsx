import { Button, CircularProgress, Container, Grid } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import request, { gql } from 'graphql-request';
import { GridColumns, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import NewProduct, { ProductDrawer } from '../../components/NewProduct';
import { Box } from '@mui/system';
import ActionDialog from '../../components/ActionDialog';
import Product from '../../models/hyperledger/product';
import { Edit } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { drawerAtom } from '../../atoms/product';
import CRUDDrawer from '../../components/CRUDDrawer';
import { globalDrawerAtom } from '../../atoms/drawer';

export type ProductGraphQLQuery = {
  productMany: Product[];
};

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

const createOneDiscount = async (item: any) => {
  const data = await request(
    `/api/graphql`,

    gql`
      mutation DiscountCreateOne($record: CreateOneDiscountInput!) {
        discountCreateOne(record: $record) {
          record {
            secret
            validDate
            discount
            isPercentage
            _id
          }
        }
      }
    `,
    {
      record: item,
    }
  );
  return data?.discountCreateOne?.record;
};

const updateOneDiscount = async (item: any) => {
  const reqData = { ...item };
  delete reqData._id;
  const data = await request(
    `/api/graphql`,

    gql`
      mutation DiscountCreateOne(
        $record: UpdateOneDiscountInput!
        $filter: FilterUpdateOneDiscountInput
      ) {
        discountUpdateOne(record: $record, filter: $filter) {
          record {
            secret
            validDate
            discount
            isEnabled
            isPercentage
            _id
          }
        }
      }
    `,
    {
      record: reqData,
      filter: {
        _id: item._id,
      },
    }
  );
  return data.discountUpdateOne.record;
};

const DiscountPage = () => {
  const [drawer, setDrawer] = useAtom(globalDrawerAtom);

  const { data, isLoading, refetch } = useQuery<ProductGraphQLQuery>(
    ['discount', drawer.page],
    async () => {
      const data = await request(
        `/api/graphql`,
        gql`
          query DiscountMany {
            discountMany {
              secret
              validDate
              discount
              isEnabled
              isPercentage
              _id
            }
          }
        `,
        {}
      );
      return data.discountMany;
    }
  );

  const columns: GridColumns = [
    { field: 'secret', headerName: 'Secret' },
    { field: 'validDate', headerName: 'validDate', type: 'date' },
    { field: 'discount', headerName: 'discount', type: 'number' },
    { field: 'isEnabled', headerName: 'Is Enabled', type: 'boolean' },
    { field: 'isPercentage', headerName: 'Percentage Type', type: 'boolean' },
    {
      field: '_id',
      headerName: 'Action',
      renderCell: (params: GridRenderCellParams<string>) => (
        <Button
          onClick={() => {
            setDrawer((prev) => ({
              ...prev,
              isOpen: true,
              pageName: 'discount',
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
        //   const newData = data?.productMany.filter(
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
              rows={Array.isArray(data) ? data : []}
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
      <CRUDDrawer
        onCreate={createOneDiscount}
        onUpdate={updateOneDiscount}
        title="discount"
        fields={[
          {
            name: 'secret',
            type: 'text',
          },
          {
            name: 'validDate',
            type: 'date',
          },
          {
            name: 'discount',
            type: 'number',
          },
          {
            name: 'isPercentage',
            type: 'boolean',
          },
          {
            name: 'isPercentage',
            type: 'boolean',
          },
        ]}
      />
    </>
  );
};

export default DiscountPage;
