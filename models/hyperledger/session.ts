import { isAddress, verifyMessage } from 'ethers/lib/utils';
import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import {
  composeMongoose,
  ObjectTypeComposerWithMongooseResolvers,
} from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import User, { UserTC } from './users';
import { requestContext } from '../../pages/api/graphql';

interface Session extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  address: string;
  fp: string;
  nonce: string;
  createdAt: Date;
}

// create Session model
const SessionSchema = new mongoose.Schema<Session>({
  address: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        console.log(isAddress(v));
        return !!isAddress(v);
      },
      message: '{VALUE} is not a valid address!',
    },
  },
  fp: {
    type: String,
    required: true,
  },
  nonce: {
    type: String,
    index: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toHexString(),
    required: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

SessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 1 });

type confirmSessionArgs = {
  secret: string;
  address: string;
};

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {
  removeFields: ['_id', '__v', 'createdAt', 'nonce'],
}; // left it empty for simplicity, described below
function createObjectTC(model: mongoose.Model<any>) {
  let ModelTC = null;

  try {
    ModelTC = schemaComposer.getOTC(model.modelName);
  } catch {
    ModelTC = composeMongoose(model, {
      inputType: {
        removeFields: ['_id', '__v', 'createdAt', 'nonce'],
      },
    });
    ModelTC.addResolver({
      name: 'confirmSession',
      type: UserTC,
      args: {
        secret: 'String!',
        address: 'String!',
      },
      resolve: async ({
        args,
        context,
      }: {
        args: confirmSessionArgs;
        context: requestContext;
      }) => {
        const { secret, address } = args;
        const result = await mongoose.model<Session>('Session').findOne({
          address: address,
        });
        if (!result) {
          throw new Error('Session not found');
        }
        const isVerfied = verifyMessage(result.nonce, secret);
        if (!isVerfied) {
          throw new Error('Secret is not valid');
        }
        let user = await User.findOneAndUpdate(
          {
            address: address,
          },
          {
            $set: {
              fp: result.fp,
            },
          }
        );
        if (!user) {
          user = await User.create({
            address: address,
            fp: result.fp,
            role: 'user',
            cart: [],
          });
        }
        context.setCookie('Authorization', `Bearer ${user.toJWT()}`, {
          httpOnly: true,
          // maxAge 1 week
          maxAge: 1000 * 60 * 60 * 24 * 7,
          secure: true,
        });
        return user;
      },
    });
  }

  return ModelTC;
}
const Session =
  mongoose.models.Session || mongoose.model<Session>('Session', SessionSchema);
const SessionTC = createObjectTC(
  Session
) as ObjectTypeComposerWithMongooseResolvers<Session>;
export { Session, SessionTC };
export default Session;
