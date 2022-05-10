import mongoose from 'mongoose';
import { DiscountTC } from './discount';
import { adminAccess } from './schemaBuilder';
import Discount from './discount';
import { createHash } from 'crypto';

const discountMutation = adminAccess({
  discountCreateOne: DiscountTC.mongooseResolvers.createOne(),
  discountCreateMany: DiscountTC.mongooseResolvers.createMany(),
  discountUpdateById: DiscountTC.mongooseResolvers.updateById(),
  discountUpdateOne: DiscountTC.mongooseResolvers.updateOne(),
  discountUpdateMany: DiscountTC.mongooseResolvers.updateMany(),
  discountRemoveById: DiscountTC.mongooseResolvers.removeById(),
  discountRemoveOne: DiscountTC.mongooseResolvers.removeOne(),
  discountRemoveMany: DiscountTC.mongooseResolvers.removeMany(),
});

const discountQuery = {
  discountOne: DiscountTC.mongooseResolvers
    .findOne({
      filter: {
        requiredFields: ['secret'],
      },
    })
    .wrapResolve((next) => (rp) => {
      if (!rp.context.user) {
        throw new Error('You are not logged in');
      }
      const secret = rp.args.filter?.secret;
      rp.beforeQuery = (query: mongoose.Query<Discount, unknown>) => {
        // Only allow users to see their own posts
        try {
          if (secret) {
            const secretHash = createHash('sha256')
              .update(secret)
              .digest('hex');
            query.where('secret', secretHash);
          } else {
            throw new Error('No secret provided');
          }
        } catch (err) {
          throw new Error('Invalid secret');
        }
      };
      return next(rp);
    }),
  ...adminAccess({
    discountById: DiscountTC.mongooseResolvers.findById(),
    discountByIds: DiscountTC.mongooseResolvers.findByIds(),
    discountMany: DiscountTC.mongooseResolvers.findMany(),
  }),
};

export { discountMutation, discountQuery };
