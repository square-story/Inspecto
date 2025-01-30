import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string | null;
    address: string | null;
    profile_image: string;
    status: boolean;
    role: string;
    authProvider: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUsers extends Document, IUserInput {
    _id: ObjectId;
}

const UsersSchema: Schema = new Schema<IUsers>({
    firstName: { type: String, required: true },
    lastName: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String, default: null },
    profile_image: { type: String, default: "" },
    status: { type: Boolean, default: true },
    role: { type: String, required: true, default: 'user' },
    authProvider: { type: String, default: 'default' }
}, { timestamps: true });

export default mongoose.model<IUsers>("User", UsersSchema);