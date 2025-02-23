import { IInspector } from "../../../models/inspector.model";
import mongoose from "mongoose";

export interface IInspectorRepository {
    findInspectorByEmail(email: string): Promise<IInspector | null>;
    updateInspector(userId: string, updates: Partial<IInspector>): Promise<IInspector | null>;
    deleteInspector(userId: string): Promise<IInspector | null>;
    getAllInspector(): Promise<IInspector[]>;
    updateInspectorPassword(email: string, password: string): Promise<IInspector | null>;
    updateInspectorProfileCompletion(userId: string): Promise<IInspector | null>;
    getNearbyInspectors(latitude: string, longitude: string): Promise<IInspector[]>;
    bookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession): Promise<IInspector | null>;
    unbookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession): Promise<IInspector | null>;
}