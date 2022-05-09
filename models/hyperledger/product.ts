import {
  composeMongoose,
  ObjectTypeComposerWithMongooseResolvers,
} from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import { ObjectTypeComposer, schemaComposer } from 'graphql-compose';

interface Product {
  productId?: string;
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// create User model
const ProductSchema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 540,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const Product =
  mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);
function createObjectTC(model: mongoose.Model<any>) {
  let ModelTC = null;

  try {
    ModelTC = schemaComposer.getOTC(model.modelName);
  } catch {
    ModelTC = composeMongoose(model, customizationOptions);
  }
  return ModelTC;
}

const ProductTC = createObjectTC(
  Product
) as ObjectTypeComposerWithMongooseResolvers<mongoose.Document<Product>>;
export { Product, ProductTC };
export default Product;
