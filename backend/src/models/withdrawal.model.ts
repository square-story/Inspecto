import { Document, model, Schema, Types } from "mongoose";

export enum WithdrawalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}


export enum WithdrawalMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    UPI = 'UPI',
    WALLET = 'WALLET'
}


export interface IBankDetails {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    branchName?: string
}

export interface IWithdrawal extends Document {
    inspector: Types.ObjectId;
    amount: number,
    status: WithdrawalStatus,
    withdrawalMethod: WithdrawalMethod,
    bankDetails?: IBankDetails,
    upiId?: string,
    requestDate: Date;
    processedDate?: Date;
    rejectionReason?: string;
    transactionId?: string;
    remarks?: string;
}

const WithdrawalSchema = new Schema<IWithdrawal>({
    inspector: {
        type: Schema.Types.ObjectId,
        ref: 'Inspector',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1000 // Minimum withdrawal amount
    },
    status: {
        type: String,
        enum: Object.values(WithdrawalStatus),
        default: WithdrawalStatus.PENDING
    },
    withdrawalMethod: {
        type: String,
        enum: Object.values(WithdrawalMethod),
        required: true
    },
    bankDetails: {
        accountNumber: {
            type: String,
            required: function () {
                return this.withdrawalMethod === WithdrawalMethod.BANK_TRANSFER;
            }
        },
        ifscCode: {
            type: String,
            required: function () {
                return this.withdrawalMethod === WithdrawalMethod.BANK_TRANSFER;
            }
        },
        accountHolderName: {
            type: String,
            required: function () {
                return this.withdrawalMethod === WithdrawalMethod.BANK_TRANSFER;
            }
        },
        bankName: {
            type: String,
            required: function () {
                return this.withdrawalMethod === WithdrawalMethod.BANK_TRANSFER;
            }
        },
        branchName: String
    },
    upiId: {
        type: String,
        required: function () {
            return this.withdrawalMethod === WithdrawalMethod.UPI;
        }
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    processedDate: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    transactionId: {
        type: String
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
})



WithdrawalSchema.index({ inspector: 1, status: 1 })
WithdrawalSchema.index({ requestDate: 1 })
WithdrawalSchema.index({ status: 1 })


export const WithDrawal = model<IWithdrawal>('WithDrawal', WithdrawalSchema)