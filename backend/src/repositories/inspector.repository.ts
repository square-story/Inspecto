import inspectorModel, { IInspector } from "../models/inspector.model";
import { IinspectorRepository } from "./interfaces/inspector.repository.interface";

export class InspectorRepository implements IinspectorRepository {
    async createInspector(userData: Partial<IInspector>): Promise<IInspector> {
        const inspector = new inspectorModel(userData)
        return await inspector.save()
    }
    async findInspectorByEmail(email: string): Promise<IInspector | null> {
        return await inspectorModel.findOne({ email })
    }
    async getAllInspector(): Promise<IInspector[]> {
        return await inspectorModel.find()
    }
    async findInspectorById(inspectorId: string): Promise<Partial<IInspector> | null> {
        return await inspectorModel.findById(inspectorId).select('-password')
    }
    async deleteInspector(userId: string): Promise<IInspector | null> {
        return await inspectorModel.findByIdAndDelete(userId)
    }
    async updateInspectorPassword(email: string, password: string): Promise<IInspector | null> {
        return await inspectorModel.findOneAndUpdate({ email }, { password }, { new: true })
    }
    async updateInspector(userId: string, updates: Partial<IInspector>): Promise<IInspector | null> {
        return await inspectorModel.findOneAndUpdate({ userId }, { ...updates }, { new: true })
    }
}