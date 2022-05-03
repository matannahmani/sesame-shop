import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useRouter } from 'next/router';

export interface UserProps {
  _id: String;
  username: String;
  connectedDevices: String[];
  adminlevel: number;
  features: String[];
  server: 'live' | 'sandbox';
}

interface loginForm {
  username: string;
  password: string;
  fingerprint: string;
}

// export const UseUserLogin = () => {
//   const queryClient = useQueryClient();
//   const { enqueueSnackbar } = useSnackbar();
//   const router = useRouter();

//   const mutation = useMutation(
//     ({ username, password, fingerprint }: loginForm) => {
//       return axios.post('/login', {
//         username: username,
//         password: password,
//         fingerprint: fingerprint,
//       });
//     },
//     {
//       retry: 0,
//       onSuccess: (data) => {
//         queryClient.setQueryData('currentUser', data?.data?.info);
//         router.push('/en/app/notifications');
//         enqueueSnackbar(t('loggedSuccess'), { variant: 'success' });
//       },
//       onError: () => {
//         enqueueSnackbar(t('emailorpassWrong'), { variant: 'error' });
//       },
//     }
//   );

//   return mutation;
// };

// export const UseLogout = () => {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const mutation = useMutation(
//     () => {
//       return axios.delete('/v1/users/logout');
//     },
//     {
//       retry: 1,
//       retryDelay: 100,
//       onSuccess: () => {},
//       onError: () => {},
//       onSettled: () => {
//         localStorage.removeItem('isLogged');
//         queryClient.removeQueries(['currentUser']);
//         router.push('/login');
//       },
//     }
//   );

//   return mutation;
// };

// export const useUser = (isEnabled?: boolean) => {
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const { t } = useTranslation('common');
//   const [retry, setRetry] = useState(false);
//   const [enabled, setEnabled] = useState(isEnabled);

//   return useQuery(
//     'currentUser',
//     async () => {
//       // const isLogged = localStorage.getItem('isLogged') === 'true';
//       // if (!isLogged) {
//       //   throw new FetchError('Not logged in', 401);
//       // }
//       const data = await errorHandlingClient.get(`v1/users/me`);
//       if (data.status > 199 && data.status < 300) {
//         return data.data;
//       } else {
//         throw new FetchError(data.data, data.status);
//       }
//     },
//     {
//       enabled: enabled,
//       refetchOnWindowFocus: true,
//       refetchOnReconnect: true,
//       retry: (count: number, error: FetchError) => {
//         if (error.statusCode === 401) {
//           // router.push('/login');
//           setEnabled(false);
//           return false;
//         }
//         if (localStorage.getItem('isLogged') === 'true' && count < 1) {
//           return true;
//         }
//         return false;
//       },
//       retryDelay: 100,
//       onSuccess: (data) => {
//         localStorage.setItem('isLogged', 'true');
//       },
//       onError: (error) => {
//         // if (!router.pathname.includes('/login')) router.push('/login');
//         localStorage.removeItem('isLogged');
//         queryClient.removeQueries(['currentUser']);
//       },
//     }
//   );
// };
