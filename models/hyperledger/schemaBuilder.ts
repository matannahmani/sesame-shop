import { SchemaComposer } from 'graphql-compose';
import { UserTC } from './users';
import User from './users';
import mongoose from 'mongoose';

const schemaComposer = new SchemaComposer();
const adminAccessOnly = (resolvers: any) => {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve(
      (next: (arg0: any) => any) =>
        async (rp: {
          beforeRecordMutate: (doc: any, rp: any) => Promise<void>;
        }) => {
          // extend resolve params with hook
          rp.beforeRecordMutate = async function (
            doc: any,
            rp: { context: { user: { role: string | string[] } } }
          ) {
            if (
              !rp.context.user ||
              !rp.context?.user?.role.includes('sesame-admin')
            ) {
              throw new Error('You are not allowed to do this');
            }
          };

          return next(rp);
        }
    );
  });
  return resolvers;
};
schemaComposer.Query.addFields({
  ...adminAccessOnly({
    userByIds: UserTC.mongooseResolvers.findByIds(),
    userById: UserTC.mongooseResolvers.findById(),
    userMany: UserTC.mongooseResolvers.findMany(),
    userOne: UserTC.mongooseResolvers.findOne(),
  }),
  me: UserTC.mongooseResolvers.findOne().wrapResolve((next) => (rp) => {
    if (!rp.context.user) {
      throw new Error('You are not logged in');
    }
    const { _id } = rp.context.user;
    rp.beforeQuery = (query: mongoose.Query<User, unknown>) => {
      // Only allow users to see their own posts
      query.where('_id', _id);
    };
    return next(rp);
  }),
});

schemaComposer.Mutation.addFields({
  ...adminAccessOnly({
    userCreateOne: UserTC.mongooseResolvers.createOne(),
    userCreateMany: UserTC.mongooseResolvers.createMany(),
    userUpdateById: UserTC.mongooseResolvers.updateById(),
    userUpdateOne: UserTC.mongooseResolvers.updateOne(),
    userUpdateMany: UserTC.mongooseResolvers.updateMany(),
    userRemoveById: UserTC.mongooseResolvers.removeById(),
    userRemoveOne: UserTC.mongooseResolvers.removeOne(),
    userRemoveMany: UserTC.mongooseResolvers.removeMany(),
  }),
});

const GraphQLSchema = schemaComposer.buildSchema();
export { GraphQLSchema };
export default GraphQLSchema;
