import { schemaComposer } from 'graphql-compose';
import { composeMongoose } from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import Product, { ProductTC } from './product';

const userRoles = ['sesame-admin', 'user', 'content-manager'] as const;
type UserRole = typeof userRoles[number];

type UserCart = [
  {
    productId: string;
    prQuantity: number;
  }
];

interface User extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  address: string;
  fp: string;
  fpValidTime: Date;
  lastActivityTime: Date;
  createdAt: Date;
  updatedAt: Date;
  cart: UserCart;
  role: UserRole;
}

// create User model
const UserSchema = new mongoose.Schema<User>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fp: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
    },
    fpValidTime: {
      type: Date,
      required: false,
    },
    lastActivityTime: {
      type: Date,
      required: false,
      default: new Date(),
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        prQuantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const UserCartTC = schemaComposer.createObjectTC(`
  type UserCart {
    prQuantity: Float!
    productId: String!
    product: Product!
  }
`);
// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const User = mongoose.model<User>('User', UserSchema);
const UserTC = composeMongoose(User, customizationOptions);
UserTC.addRelation('cart', {
  prepareArgs: {
    _ids: (source) => source.cart.map((item) => item.productId),
  },
  // type: `type UserCart { prQuantity: Float, productId: String, product: Product }`,
  type: `[${UserCartTC.getTypeName()}]`,
  resolve: async (source, args, context, info) => {
    const { cart } = source;
    const productIds = cart.map((item) => item.productId);
    const result = await ProductTC.mongooseResolvers.findByIds().resolve({
      source: {
        _id: source._id,
      },
      args: {
        _ids: productIds,
      },
    });
    const cartItems = cart.map((product) => ({
      productId: product.productId,
      prQuantity: product.prQuantity,
      product: result.find(
        (item: Product) => `${item._id}` === `${product.productId}`
      ),
    }));
    return cartItems;
  },
  projection: {
    cart: {
      prQuantity: true,
      productId: true,
      product: true,
    },
  },
});
// UserTC.addRelation('cart', {
//   resolver: () => ProductTC.mongooseResolvers.findByIds(),
//   prepareArgs: {
//     // resolver `findByIds` has `_ids` arg, let provide value to it
//     _ids: (source) => source.cart.map((item) => item.productId) || [],
//   },
//   projection: { cart: true }, // point fields in source object, which should be fetched from DB
// });
export { User, UserTC };
export default User;
