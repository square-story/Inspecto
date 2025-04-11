import { Schema, model, Document, ObjectId } from 'mongoose'

export enum TransactionType {
    EARNED = 'EARNED',
    WITHDRAWN = 'WITHDRAWN',
    PLATFORM_FEE = 'PLATFORM_FEE',
    REFUND = 'REFUND'
}


export enum WalletOwnerType {
    INSPECTOR = 'INSPECTOR',
    ADMIN = 'ADMIN'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED'
}

export interface IWalletTransaction {
    _id?: ObjectId;
    amount: number;
    date: Date;
    type: TransactionType;
    status: TransactionStatus;
    reference: string;
    description?: string;
}

export interface IWallet extends Document {
    owner: ObjectId;
    ownerType: WalletOwnerType;
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
    isLocked: boolean;
    transactions: Array<IWalletTransaction>;
    lastTransactionDate?: Date;
}

const WalletSchema = new Schema<IWallet>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'ownerType'
    },
    ownerType: {
        type: String,
        enum: Object.values(WalletOwnerType),
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    pendingBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    totalEarned: {
        type: Number,
        default: 0
    },
    totalWithdrawn: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    transactions: [{
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true
        },
        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            default: TransactionStatus.PENDING
        },
        reference: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    }],
    lastTransactionDate: {
        type: Date
    }
}, {
    timestamps: true
})

// Indexes
WalletSchema.index({ owner: 1, ownerType: 1 }, { unique: true })
WalletSchema.index({ 'transactions.date': 1 })
WalletSchema.index({ 'transactions.status': 1 })

export const Wallet = model<IWallet>('Wallet', WalletSchema)