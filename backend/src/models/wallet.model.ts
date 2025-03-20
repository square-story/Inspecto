import {Schema,model,Document, ObjectId} from 'mongoose'

export interface IWallet extends Document{
    inspector:ObjectId;
    balance:number;
    pendingBalance:number;
    transactions:Array<IWalletTransaction>
}

export interface IWalletTransaction{
    amount:number;
    date:Date;
    type:string;
    status:string;
    reference:string;
}

const WalletSchema = new Schema<IWallet>({
    inspector:{
        type:Schema.Types.ObjectId,
        ref:'Inspector',
        required:true
    },
    balance:{
        type:Number,
        default:0
    },
    pendingBalance:{
        type:Number,
        default:0
    },
    transactions:[{
        amount:{
            type:Number,
        },
        date:{
            type:Date,
            default:Date.now
        },
        type:{
            type:String,
            enum:['EARNED','WITHDRAWN','FEE'],
            default:'EARNED'
        },
        status:{
            type:String,
            enum:['PENDING','COMPLETED','FAILED'],
            default:'PENDING'
        },
        reference:{
            type:String
        }
    }]
})

export const Wallet = model<IWallet>('Wallet',WalletSchema)