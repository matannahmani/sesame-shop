import mongoose, { Document, Model } from 'mongoose';
// transaction schema

export interface txDataExplorer {
  userId?: string;
  keyId?: string;
  partnerId: number;
  privateData?: Object;
  actionName: string;
  fabricVersion: number;
  data?: Object | string;
}

interface HyperledgerTXInterface extends Model<HyperledgerTransactionProps> {
  // declare any static methods here
  getDailyByWeek(): Promise<txDataExplorer[]>;
}

export interface HyperledgerTransactionProps extends Document {
  txName: string;
  txId: string;
  txData: txDataExplorer;
  fabricVersion?: number;
  createdAt: Date;
  blockNumber: number;
}

const txData = {
  userId: {
    type: String,
  },
  keyId: {
    type: String,
  },
  partnerId: {
    type: Number,
  },
  privateData: {
    type: Object,
  },
  actionName: {
    type: String,
  },
  status: {
    type: String,
  },
  data: {
    type: Object,
  },
};

// mongoose schema
const HyperledgerTransactionSchema = new mongoose.Schema(
  {
    txName: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      required: true,
      min: 0,
    },
    fabricVersion: {
      type: Number,
      required: true,
      default: 2,
    },
    txId: {
      type: String,
      required: true,
      index: true,
    },
    txData: [txData] || txData,
  },
  { timestamps: true }
);
HyperledgerTransactionSchema.index(
  {
    txId: 1,
    fabricVersion: 1,
  },
  {
    unique: true,
    name: 'tx_id_fbVersion',
  }
);
HyperledgerTransactionSchema.index({ blockNumber: -1 });
HyperledgerTransactionSchema.index(
  { createdAt: -1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 7,
    background: true,
    name: 'block_created_at_index',
  }
);

// init
const HyperledgerTransaction = mongoose.model<
  HyperledgerTransactionProps,
  HyperledgerTXInterface
>('Transaction', HyperledgerTransactionSchema);

export default HyperledgerTransaction;
