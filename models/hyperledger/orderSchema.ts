import { OrderTC } from './order';
import { adminAccess } from './schemaBuilder';

const orderMutation = adminAccess({
  orderCreateOne: OrderTC.mongooseResolvers.createOne(),
  orderCreateMany: OrderTC.mongooseResolvers.createMany(),
  orderUpdateById: OrderTC.mongooseResolvers.updateById(),
  orderUpdateOne: OrderTC.mongooseResolvers.updateOne(),
  orderUpdateMany: OrderTC.mongooseResolvers.updateMany(),
  orderRemoveById: OrderTC.mongooseResolvers.removeById(),
  orderRemoveOne: OrderTC.mongooseResolvers.removeOne(),
  orderRemoveMany: OrderTC.mongooseResolvers.removeMany(),
});

const orderQuery = adminAccess({
  orderByIds: OrderTC.mongooseResolvers.findByIds(),
  orderById: OrderTC.mongooseResolvers.findById(),
  orderMany: OrderTC.mongooseResolvers.findMany(),
  orderOne: OrderTC.mongooseResolvers.findOne(),
});

export { orderMutation, orderQuery };
