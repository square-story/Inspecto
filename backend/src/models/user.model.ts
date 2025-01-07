import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUsers extends Document {
    _id: ObjectId;
    FirstName: string;
    LastName: string;
    Created_at: Date;
    Email: string;
    Password: string;
    Address: string | null;
    Updated_at: Date;
    Profile_image: string | null;
    Status: boolean;
}

const UsersSchema: Schema = new Schema<IUsers>({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Created_at: { type: Date, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Address: { type: String, default: null },
    Updated_at: { type: Date, required: true },
    Profile_image: { type: String, default: null },
    Status: { type: Boolean, required: true, default: true }
}, { timestamps: true })

const Users = mongoose.model<IUsers>('Users', UsersSchema);

export default Users;