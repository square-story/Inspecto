import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IAdmin extends Document {
    _id: ObjectId;
    email: string;
    password: string;
    role?: string;
}

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
})


export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema)
