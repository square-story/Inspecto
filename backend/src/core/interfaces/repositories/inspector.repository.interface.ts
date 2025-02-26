import { IInspector } from "../../../models/inspector.model";
import mongoose from "mongoose";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IInspectorRepository extends BaseRepository<IInspector> {
    updateInspectorPassword(email: string, password: string): Promise<IInspector | null>;
    getNearbyInspectors(latitude: string, longitude: string): Promise<IInspector[]>;
    bookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession): Promise<IInspector | null>;
    unbookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession): Promise<IInspector | null>;
    updateInspectorProfileCompletion(userId: string): Promise<IInspector | null>
}