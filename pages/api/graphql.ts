import { ApolloServer, gql } from 'apollo-server-micro';
import GraphQLSchema from '../../models/hyperledger/schemaBuilder';
import dbConnect from '../../utils/dbConnect';
import jwt from 'jsonwebtoken';
import User from '../../models/hyperledger/users';
import { NextApiRequest, NextApiResponse } from 'next';
import initMiddleware from '../../utils/init-middleware';
import Cors from 'cors';
import { setCookie } from '../../utils/cookies';
import { CookieSerializeOptions } from 'cookie';

export type requestContext = {
  setCookie: (
    name: string,
    value: string,
    options: CookieSerializeOptions
  ) => void;
  user?: User;
};

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
    // Allow requests from any domain
    origin: '*',
    // Allow cookies to be shared
    credentials: true,
  })
);

const apolloServer = new ApolloServer({
  schema: GraphQLSchema,
  context: async ({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => {
    await dbConnect();
    const context = {
      setCookie: (
        name: string,
        value: string,
        options: CookieSerializeOptions
      ) => setCookie(res, name, value, options),
    } as requestContext;
    if (req.cookies.Authorization) {
      let user = null;
      try {
        const token = req.cookies.Authorization.split(' ')[1];
        const jwtDecoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (typeof jwtDecoded === 'object') {
          user = await User.findById(jwtDecoded?._id);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (user) {
          context.user = user;
        }
      }
    }
    return context;
  },
});

const startServer = apolloServer.start();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
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
