import {
  composeMongoose,
  ObjectTypeComposerWithMongooseResolvers,
} from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import { ObjectTypeComposer, schemaComposer } from 'graphql-compose';
import { createHash } from 'crypto';

interface productCode {
  secret: string;
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// create User model
const productCodeSchema = new mongoose.Schema<productCode>(
  {
    secret: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  {
    timestamps: true,
  }
);
productCodeSchema.index({ createdAt: 1 });
productCodeSchema.index({ updatedAt: 1 });
// productCodeSchema.pre('save', function (next) {
//   if (this.isNew || this.isModified('secret'))
//     this.secret = createHash('sha256').update(this.secret).digest('hex');
// });
// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const productCode =
  mongoose.models.productCode ||
  mongoose.model<productCode>('productCode', productCodeSchema);
function createObjectTC(model: mongoose.Model<any>) {
  let ModelTC = null;

  try {
    ModelTC = schemaComposer.getOTC(model.modelName);
  } catch {
    ModelTC = composeMongoose(model, customizationOptions);
  }
  return ModelTC;
}

const productCodeTC = createObjectTC(
  productCode
) as ObjectTypeComposerWithMongooseResolvers<mongoose.Document<productCode>>;
export { productCode, productCodeTC };
export default productCode;
