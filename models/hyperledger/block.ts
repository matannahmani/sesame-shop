import { createHash, randomInt, randomUUID } from 'crypto';
import mongoose, { Document } from 'mongoose';

export interface blockUserProps {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  joinTime: Date;
  reward: number;
}

export interface BlockProps extends Document {
  checkDuplicates: () => boolean;
  number: number;
  userLimit: number;
  userCount: number;
  users: blockUserProps[];
  endTime: Date;
  startTime: Date;
  totalReward: number;
}

const blockSchema = new mongoose.Schema<BlockProps>(
  {
    number: {
      type: Number,
      required: true,
      min: 0,
      unique: true,
      index: true,
    },
    userLimit: {
      type: Number,
      default: 100,
      required: true,
    },
    userCount: {
      type: Number,
      default: 0,
      required: true,
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
        joinTime: {
          type: Date,
          default: new Date(),
          required: true,
        },
        reward: {
          type: Number,
          default: 0,
          required: true,
        },
      },
    ],
    totalReward: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 1000,
    },
    endTime: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, optimisticConcurrency: true }
);

// const convertRange = (value, r1, r2) => {
//   return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
// };

// block time 30 - 90 minutes
// blocks per day max 20 min 10
// we run this for 1-2 year (max blocks 10000)

export const blockLimit = 10000;
export const blockTimeRange = [30, 90];
export const maxBlocksPerDay = 20;
export const minBlocksPerDay = 10;

const generateSeed = (date: Date, nonce: string) => {
  const seed = createHash('sha256')
    .update(date.valueOf().toString() + nonce)
    .digest('hex');
  return seed;
};

const getHashResult = (hash: string) => {
  const subHash = hash.slice(0, 8);
  const spinNumber = parseInt(subHash, 16);
  return Math.abs(spinNumber) % 100;
};

// let results = Array(100).fill(0);

// for (let index = 0; index < 10000; index++) {
//   const { seed, nonce } = generateSeed();
//   const spinNumber = getHashResult(seed);
//   results[spinNumber] += 1;
// }

const getHashRewardGroup = (hash: number) => {
  if (hash < 20) {
    return 1;
  }
  if (hash > 19 && hash < 40) {
    return 2;
  }
  if (hash >= 54 && hash < 89) {
    return 2;
  }
  if (hash >= 89 && hash < 95) {
    return 5;
  }
  if (hash >= 95 && hash < 98) {
    return 10;
  }
  if (hash === 99) {
    return 25;
  }
};
// calculate the reward for the block
export const calculateReward = (user: blockUserProps, block: BlockProps) => {
  const seed = generateSeed(user.joinTime, `${user._id}`);
  const hashResult = getHashResult(seed);
  const reward = getHashRewardGroup(hashResult);
  return reward;
};

blockSchema.methods.checkDuplicates = function (this: BlockProps) {
  let seen = new Set();
  const hasDuplicates = this.users.some((user) => {
    return seen.size === seen.add(`${user.userId}`).size;
  });
  return hasDuplicates;
};

blockSchema.pre<BlockProps>('validate', async function (next) {
  if (this.isNew) {
    const Block = this.constructor;
    // @ts-ignore
    const lastBlock = await Block.findOne<Block>().sort({ endTime: -1 }).exec();
    if (lastBlock) {
      this.number = lastBlock.number + 1;
      // attempt to give tokens to the users of previous block
      const users = lastBlock.users;
    } else {
      this.number = 0;
    }
  }
  next();
});

blockSchema.pre<BlockProps>(
  ['save', 'updateOne'],
  async function (this: BlockProps, next: (a?: any | Error) => void) {
    const Block = this.constructor;
    if (this.isNew) {
      // @ts-ignore
      const lastBlock = await Block.findOne<BlockProps>()
        .sort({ endTime: -1 })
        .exec();
      if (lastBlock && lastBlock.endTime > new Date())
        return next(new Error('Cant create a Block before last didnt finish'));
      if (lastBlock && lastBlock.endTime > this.startTime)
        return next(new Error('Cant create a Block before last ended'));
    }
    if (this.startTime > this.endTime)
      next(new Error('startTime must be before endTime'));
    if (this.userCount > this.userLimit || this.users.length > this.userLimit)
      next(new Error('userCount must be less than userLimit'));
    if (new Date() > this.endTime)
      next(
        new Error(
          'cannot create block in the past or edit a block that finished'
        )
      );
    if (this.isModified('users')) {
      // check if this.users has duplicate
      if (this.checkDuplicates()) {
        const filtredUsers = this.users.filter(
          (v, i, a) => a.findIndex((t) => t.userId === v.userId) === i
        );
        this.users = [...filtredUsers];
      }
    }
    //   // calculate users total reward
    //   const totalReward = this.users.reduce((acc, cur) => acc + cur.reward, 0);
    //   if (totalReward > 1000) return next(new Error('Sorry block is full :('));
    //   this.totalReward = totalReward;
    //   this.userLimit = (1000 - totalReward) / 2;
    // }
    // if (this.isModified('users') || this.isNew) {
    //   if (this.users.length === 0) {
    //     this.userCount = 0;
    //   } else {
    //     this.userCount = this.users.length;
    //   }
    // }
    next();
  }
);

const Block = mongoose.model<BlockProps>('Block', blockSchema);

export default Block;
