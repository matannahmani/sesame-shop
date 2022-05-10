import {
  Drawer,
  Fab,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation, useQueryClient } from 'react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAtom } from 'jotai';

import { baseProductDrawerAtom } from '../atoms/product';
import { useSnackbar } from 'notistack';
import { globalDrawerAtom, baseDrawerAtom } from '../atoms/drawer';
export type ProductDrawer = {
  isEditing: boolean;
  id: string;
};

type CrudField = {
  name: string;
  type: 'text' | 'number' | 'textarea' | 'date' | 'boolean';
};

type CrudDrawer = {
  fields: CrudField[];
  onCreate: (item: any) => void;
  onUpdate: (item: any) => void;
  title: string;
};

const CrudDrawer = ({ title, fields, onCreate, onUpdate }: CrudDrawer) => {
  const [drawer, setDrawer] = useAtom(globalDrawerAtom);
  const baseState = fields.reduce((acc, field) => {
    if (field.type === 'date') {
      acc[field.name] = new Date();
    } else if (field.type === 'boolean') {
      acc[field.name] = false;
    } else acc[field.name] = '';
    return acc;
  }, {});
  const [item, setItem] = useState(baseState);
  const { enqueueSnackbar } = useSnackbar();
  const onTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.type === 'number')
      setItem((prev) => ({
        ...prev,
        [e.target.id]: Number(e.target.value),
      }));
    else setItem((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const cleanQuery = () => {
    setItem(baseState);
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    if (drawer.isOpen && drawer.isEditing && drawer._id) {
      console.log('title', title);
      const cachedData = queryClient.getQueryData([title, 0]);
      console.log('cachedData', cachedData);
      if (cachedData && Array.isArray(cachedData)) {
        const item = cachedData?.find(
          (item: { _id: any }) => `${item._id}` === drawer._id
        );
        if (item) {
          setDrawer((prev) => ({
            ...prev,
            isOpen: true,
            isEditing: true,
            _id: `${item._id}`,
            isLoading: false,
          }));
          setItem(item);
          return;
        }
      }
      cleanQuery();
      setDrawer(baseDrawerAtom);
    }
  }, [drawer.isOpen, drawer.isEditing, drawer._id]);

  const { isLoading, mutateAsync } = useMutation(
    async () => await onCreate(item),
    {
      onSuccess: (data) => {
        closeDrawer();
        enqueueSnackbar(`Product ${data?.name} created successfully`, {
          variant: 'success',
        });
        const productsData = queryClient.getQueryData(title);
        if (Array.isArray(productsData)) {
          queryClient.setQueryData(title, [...productsData, data]);
        } else {
          queryClient.setQueryData(title, [data]);
        }
        queryClient.invalidateQueries(title);
      },
      onError: (error) => {
        enqueueSnackbar(`Product creation failed: ${error}`, {
          variant: 'error',
        });
      },
    }
  );

  const { isLoading: patchLoading, mutateAsync: patchMutateAsync } =
    useMutation(async () => await onUpdate(item), {
      onSuccess: (data) => {
        closeDrawer();
        enqueueSnackbar(`Product ${data?.name} modifed successfully`, {
          variant: 'success',
        });
        const productsData = queryClient.getQueryData(title);
        if (Array.isArray(productsData)) {
          const optimisticData = productsData.map((product) =>
            product._id === data._id
              ? {
                  data,
                }
              : product
          );
          queryClient.setQueryData(title, optimisticData);
        }
        queryClient.invalidateQueries(title);
      },
      onError: (error) => {
        enqueueSnackbar(`Error: ${error?.message}`, {
          variant: 'error',
        });
      },
    });

  const closeDrawer = () => {
    setDrawer(baseDrawerAtom);
    cleanQuery();
  };

  const FieldRender = (props: { field: CrudField }) => {
    const field = props.field;
    if (field.type === 'date') {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={field.name}
            value={item[field.name]}
            onChange={(newValue) => {
              setItem((prev) => ({ ...prev, [field.name]: newValue }));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      );
    }
    if (field.type === 'boolean') {
      return (
        <Switch
          aria-label="toggle"
          checked={item[field.name]}
          onChange={(e) =>
            setItem((prev) => ({ ...prev, [field.name]: e.target.checked }))
          }
        />
      );
    }
    return (
      <TextField
        value={item[field.name]}
        type={field.type}
        id={field.name}
        sx={{
          textTransform: 'capitalize',
        }}
        onChange={onTextChange}
        label={`${field.name}`}
      />
    );
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
          {fields.map((field) => (
            <FieldRender field={field} key={field.name} />
          ))}
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

export default memo(CrudDrawer);
