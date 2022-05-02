import { composeMongoose } from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import Product from './product';

const userRoles = ['sesame-admin', 'user', 'content-manager'] as const;
type UserRole = typeof userRoles[number];

interface User extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  address: string;
  fp: string;
  fpValidTime: Date;
  lastActivityTime: Date;
  createdAt: Date;
  updatedAt: Date;
  cart: [Product];
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
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const User = mongoose.model<User>('User', UserSchema);
const UserTC = composeMongoose(User, customizationOptions);
export { User, UserTC };
export default User;
