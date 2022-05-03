import { composeMongoose } from 'graphql-compose-mongoose';
import mongoose from 'mongoose';

interface Product extends mongoose.Document {
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
const Product = mongoose.model<Product>('Product', ProductSchema);
const ProductTC = composeMongoose(Product, customizationOptions);
export { Product, ProductTC };
export default Product;
