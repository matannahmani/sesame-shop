import mongoose from 'mongoose';
import { DiscountTC } from './discount';
import { adminAccess } from './schemaBuilder';
import Discount from './discount';
import { createHash } from 'crypto';

const discountMutation = {
  discountCreateOne: DiscountTC.mongooseResolvers.createOne(),
  ...adminAccess({
    discountCreateMany: DiscountTC.mongooseResolvers.createMany(),
    discountUpdateById: DiscountTC.mongooseResolvers.updateById(),
    discountUpdateOne: DiscountTC.mongooseResolvers.updateOne(),
    discountUpdateMany: DiscountTC.mongooseResolvers.updateMany(),
    discountRemoveById: DiscountTC.mongooseResolvers.removeById(),
    discountRemoveOne: DiscountTC.mongooseResolvers.removeOne(),
    discountRemoveMany: DiscountTC.mongooseResolvers.removeMany(),
  }),
};

const discountQuery = {
  checkDiscountCode: DiscountTC.getResolver('checkCode'),
  discountMany: DiscountTC.mongooseResolvers.findMany(),
  ...adminAccess({
    discountOne: DiscountTC.mongooseResolvers.findOne(),
    discountById: DiscountTC.mongooseResolvers.findById(),
    discountByIds: DiscountTC.mongooseResolvers.findByIds(),
  }),
};

export { discountMutation, discountQuery };
