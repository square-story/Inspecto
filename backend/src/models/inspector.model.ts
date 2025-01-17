import mongoose, { Schema, Document, ObjectId } from 'mongoose'


export interface IInspectorInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string | null;
    address: string;
    profile_image: string;
    status: boolean;
    role: string;
    certificates: [Object];
    yearOfExp: number;
    phone: string;
    signature: string;
    specialization: [string],
    start_time: Date;
    end_time: Date;
    avaliable_days: number;
    isListed: boolean;
    isCompleted:boolean;
}

export interface IInspector extends Document, IInspectorInput {
    _id: ObjectId
}

const InspectorSchema: Schema = new Schema<IInspector>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    profile_image: { type: String },
    status: { type: Boolean, default: true },
    role: { type: String, default: 'inspector' },
    certificates: { type: [Object]},
    yearOfExp: { type: Number },
    phone: { type: String, required: true },
    signature: { type: String},
    specialization: { type: [String] },
    start_time: { type: Date },
    end_time: { type: Date },
    avaliable_days: { type: Number },
    isListed: { type: Boolean, default: false },
    isCompleted:{type:Boolean,default:false}
})

export default mongoose.model<IInspector>("Inspector", InspectorSchema);