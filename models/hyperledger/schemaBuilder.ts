import {
  ObjectTypeComposer,
  Resolver,
  ResolverResolveParams,
  SchemaComposer,
} from 'graphql-compose';
import User, { UserTC } from './users';
import mongoose from 'mongoose';
import { ProductTC } from './product';

const schemaComposer = new SchemaComposer();

function adminAccess(
  resolvers: Record<string, Resolver>
): Record<string, Resolver> {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      if (
        !rp.context.user ||
        rp.context?.user?.role.indexOf('sesame-admin') === -1
      ) {
        console.error("You don't have access to this resource");
        throw new Error('You are not allowed to do this');
      }
      return next(rp);
    });
  });

  return resolvers;
}

schemaComposer.Query.addFields({
  ...adminAccess({
    userByIds: UserTC.mongooseResolvers.findByIds(),
    userById: UserTC.mongooseResolvers.findById(),
    userMany: UserTC.mongooseResolvers.findMany(),
    userOne: UserTC.mongooseResolvers.findOne(),
  }),
  productByIds: ProductTC.mongooseResolvers.findByIds(),
  productById: ProductTC.mongooseResolvers.findById(),
  productMany: ProductTC.mongooseResolvers.findMany(),
  productOne: ProductTC.mongooseResolvers.findOne(),
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
  ...adminAccess({
    userCreateOne: UserTC.mongooseResolvers.createOne(),
    userCreateMany: UserTC.mongooseResolvers.createMany(),
    userUpdateById: UserTC.mongooseResolvers.updateById(),
    userUpdateOne: UserTC.mongooseResolvers.updateOne(),
    userUpdateMany: UserTC.mongooseResolvers.updateMany(),
    userRemoveById: UserTC.mongooseResolvers.removeById(),
    userRemoveOne: UserTC.mongooseResolvers.removeOne(),
    userRemoveMany: UserTC.mongooseResolvers.removeMany(),
    productCreateOne: ProductTC.mongooseResolvers.createOne(),
    productCreateMany: ProductTC.mongooseResolvers.createMany(),
    productUpdateById: ProductTC.mongooseResolvers.updateById(),
    productUpdateOne: ProductTC.mongooseResolvers.updateOne(),
    productUpdateMany: ProductTC.mongooseResolvers.updateMany(),
    productRemoveById: ProductTC.mongooseResolvers.removeById(),
    productRemoveOne: ProductTC.mongooseResolvers.removeOne(),
    productRemoveMany: ProductTC.mongooseResolvers.removeMany(),
  }),
  me: UserTC.mongooseResolvers
    .updateOne()
    .wrapResolve((next) => (rp) => {
      if (!rp.context.user) {
        throw new Error('You are not logged in');
      }
      const { _id } = rp.context.user;
      rp.args.filter = { id: _id };
      rp.beforeQuery = (query: mongoose.Query<User, unknown>) => {
        // Only allow users to see their own posts
        query.where('_id', _id);
      };
      return next(rp);
    })
    .removeArg(['address', 'lastActivityTime', 'cart', '_id']),
});

const GraphQLSchema = schemaComposer.buildSchema();
export { GraphQLSchema };
export default GraphQLSchema;
