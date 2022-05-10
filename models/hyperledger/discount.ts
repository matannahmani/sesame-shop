import {
  composeMongoose,
  ObjectTypeComposerWithMongooseResolvers,
} from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import { ObjectTypeComposer, schemaComposer } from 'graphql-compose';
import { createHash } from 'crypto';

interface Discount {
  secret: string;
  _id: mongoose.Types.ObjectId;
  validDate: Date;
  discount: number;
  isPercentage: boolean;
}

// create User model
const DiscountSchema = new mongoose.Schema<Discount>(
  {
    secret: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 320,
      immutable(this, doc) {
        return doc.secret && doc.secret.length > 0;
      },
    },
    validDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    isPercentage: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
DiscountSchema.index({ createdAt: 1 });
DiscountSchema.index({ updatedAt: 1 });

DiscountSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('secret')) {
    if (this.secret.length > 64) {
      throw new Error('Secret is too long');
    }
    this.secret = createHash('sha256').update(this.secret).digest('hex');
    // this.save();
  }
  next();
});
// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const Discount =
  mongoose.models.Discount ||
  mongoose.model<Discount>('Discount', DiscountSchema);
function createObjectTC(model: mongoose.Model<any>) {
  let ModelTC = null;

  try {
    ModelTC = schemaComposer.getOTC(model.modelName);
  } catch {
    ModelTC = composeMongoose(model, customizationOptions);
  }
  return ModelTC;
}

const DiscountTC = createObjectTC(
  Discount
) as ObjectTypeComposerWithMongooseResolvers<mongoose.Document<Discount>>;
export { Discount, DiscountTC };
export default Discount;
