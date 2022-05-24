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
  isEnabled: boolean;
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
      maxlength: 24,
    },
    isEnabled: {
      type: Boolean,
      required: true,
      default: true,
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

type checkCodeArgs = {
  secret: string;
};

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
    ModelTC.addResolver({
      name: 'checkCode',
      type: ModelTC,
      args: {
        secret: 'String!',
      },
      resolve: async ({ args }: { args: checkCodeArgs }) => {
        const { secret } = args;
        const discount = await Discount.findOne({
          secret: secret,
          isEnabled: true,
          validDate: { $gt: new Date() },
        });
        if (discount) {
          return discount;
        }
        throw new Error('Discount not found');
      },
    });
  }
  return ModelTC;
}

const DiscountTC = createObjectTC(
  Discount
) as ObjectTypeComposerWithMongooseResolvers<mongoose.Document<Discount>>;
export { Discount, DiscountTC };
export default Discount;
