import { ApolloServer, gql } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import GraphQLSchema from '../../models/hyperledger/schemaBuilder';
import dbConnect from '../../utils/dbConnect';
import jwt from 'jsonwebtoken';
import User from '../../models/hyperledger/users';
import { NextApiRequest, NextApiResponse } from 'next';

const apolloServer = new ApolloServer({
  schema: GraphQLSchema,
  context: async ({ req }: { req: MicroRequest }) => {
    await dbConnect();
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      let user = null;
      try {
        const jwtDecoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (typeof jwtDecoded === 'object') {
          user = await User.findById(jwtDecoded?._id);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (user) {
          return { user: user };
        }
      }
    }
  },
});

const startServer = apolloServer.start();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD'
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
