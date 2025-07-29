import { IInspector } from "../../models/inspector.model";
import { IInspectorDTO } from "../interfaces/inspector.dto";

export function mapInspector(inspector: IInspector): IInspectorDTO {
    return {
        _id: inspector._id.toString(),
        firstName: inspector.firstName,
        lastName: inspector.lastName,
        email: inspector.email,
        address: inspector.address,
        profile_image: inspector.profile_image,
        status: inspector.status,
        role: inspector.role,
        certificates: inspector.certificates,
        yearOfExp: inspector.yearOfExp,
        phone: inspector.phone,
        signature: inspector.signature,
        specialization: inspector.specialization,
        availableSlots: inspector.availableSlots,
        unavailabilityPeriods: inspector.unavailabilityPeriods,
        bookedSlots: inspector.bookedSlots,
        isListed: inspector.isListed,
        isCompleted: inspector.isCompleted,
        approvedAt: inspector.approvedAt,
        deniedAt: inspector.deniedAt,
        denialReason: inspector.denialReason,
        coverageRadius: inspector.coverageRadius,
        serviceAreas: inspector.serviceAreas,
        createdAt: inspector.createdAt,
        updatedAt: inspector.updatedAt,
        location: inspector.location
    };
}