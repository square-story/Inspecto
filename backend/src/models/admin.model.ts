import { model, Schema } from "mongoose";

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
})

export const AdminModal = model('Admin', AdminSchema)