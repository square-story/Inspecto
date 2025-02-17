import mongoose from "mongoose";
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
    async getNearbyInspectors(latitude: string, longitude: string) {
        return await inspectorModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: 10000
                }
            }
        })
    }

    async bookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession) {
        const updateOperation = {
            $push: {
                bookedSlots: {
                    date: date,
                    slotsBooked: 1,
                    bookedBy: userId
                }
            }
        };

        if (session) {
            return await inspectorModel.findByIdAndUpdate(
                inspectorId,
                updateOperation,
                { session }
            );
        } else {
            return await inspectorModel.findByIdAndUpdate(
                inspectorId,
                updateOperation
            );
        }
    }

    async unbookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession) {
        const updateOperation = {
            $pull: {
                bookedSlots: {
                    date: date,
                    slotsBooked: 1,
                    bookedBy: userId
                }
            }
        };

        if (session) {
            return await inspectorModel.findByIdAndUpdate(
                inspectorId,
                updateOperation,
                { session }
            );
        } else {
            return await inspectorModel.findByIdAndUpdate(
                inspectorId,
                updateOperation
            );
        }
    }
}