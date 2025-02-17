import inspectorModel, { IInspector } from "../models/inspector.model";
import { IinspectorRepository } from "./interfaces/inspector.repository.interface";

export class InspectorRepository implements IinspectorRepository {
    async createInspector(userData: Partial<IInspector>): Promise<IInspector> {
        const inspector = new inspectorModel(userData)
        return await inspector.save()
    }
    async findInspectorByEmail(email: string): Promise<IInspector | null> {
        return await inspectorModel.findOne({ email }).exec()
    }
    async getAllInspector(): Promise<IInspector[]> {
        return await inspectorModel.find().select('-password').sort({ createdAt: -1 })
    }
    async findInspectorById(inspectorId: string): Promise<IInspector | null> {
        return await inspectorModel.findById(inspectorId)
    }
    async deleteInspector(userId: string): Promise<IInspector | null> {
        return await inspectorModel.findByIdAndDelete(userId)
    }
    async updateInspectorPassword(email: string, password: string): Promise<IInspector | null> {
        return await inspectorModel.findOneAndUpdate({ email }, { password }, { new: true })
    }
    async updateInspector(userId: string, updates: Partial<IInspector>): Promise<IInspector | null> {
        return await inspectorModel.findOneAndUpdate({ _id: userId }, { ...updates }, { new: true })
    }
    async updateInspectorProfileCompletion(userId: string) {
        return await inspectorModel.findOneAndUpdate({ _id: userId }, { isCompleted: true }, { new: true, runValidators: true }).select('-password')
    }
}