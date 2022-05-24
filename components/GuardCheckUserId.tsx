import { CircularProgress, Container } from '@mui/material';
import { gql } from 'apollo-server-micro';
import request from 'graphql-request';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import User from '../models/hyperledger/users';

const useGuardCheckUserId = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  //   console.log(queryClient.getQueryData('user/id'));
  //   const id = queryClient.getQueryData('user/id');
  const id = '626f7150ddfedb708ff69638';

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<User>(
    'currentUser',
    async () => {
      const data = await request(
        `/api/graphql`,
        gql`
          query UserOne($id: MongoID!) {
            userById(_id: $id) {
              _id
            }
          }
        `,
        { id: id },
        {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiX2lkIjoiNjI2ZjcxNTBkZGZlZGI3MDhmZjY5NjM4IiwiaWF0IjoxNTE2MjM5MDIyfQ.60XyJxf-8Sh6ENU68GUNQuc5fB76VPAVTAr1gzztOT4',
        }
      );

      return data.userById;
    }
  );

  const isAllowed = !isLoading && !isError && isSuccess;

  useEffect(() => {
    if ((isError && !isLoading) || data === null) {
      router.replace('/');
    }
  }, [isAllowed, isError]);

  if (!isAllowed)
    return {
      loading: true,
      component: (
        <CircularProgress
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ),
    };

  return { loading: false, component: null };
};

export default useGuardCheckUserId;
