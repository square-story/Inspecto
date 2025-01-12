import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    address: string | null;
    profile_image: string | null;
    status: boolean;
    role: string;
}

export interface IUsers extends Document, IUserInput {
    _id: ObjectId;
}

const UsersSchema: Schema = new Schema<IUsers>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    address: { type: String, default: null },
    profile_image: { type: String, default: null },
    status: { type: Boolean, default: true },
    role: { type: String, required: true }
});

export default mongoose.model<IUsers>("Users", UsersSchema);