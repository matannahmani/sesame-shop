import {
  composeMongoose,
  ObjectTypeComposerWithMongooseResolvers,
} from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import { ObjectTypeComposer, schemaComposer } from 'graphql-compose';

interface Order {
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  user: mongoose.Types.ObjectId[];
  _id: mongoose.Types.ObjectId;
  price: number;
  discountCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// create User model
const OrderSchema = new mongoose.Schema<Order>(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
OrderSchema.index({ createdAt: 1 });
OrderSchema.index({ updatedAt: 1 });
// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const Order =
  mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);
function createObjectTC(model: mongoose.Model<any>) {
  let ModelTC = null;

  try {
    ModelTC = schemaComposer.getOTC(model.modelName);
  } catch {
    ModelTC = composeMongoose(model, customizationOptions);
  }
  return ModelTC;
}

const OrderTC = createObjectTC(
  Order
) as ObjectTypeComposerWithMongooseResolvers<mongoose.Document<Order>>;
export { Order, OrderTC };
export default Order;
