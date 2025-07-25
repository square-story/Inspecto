import { IUsers } from "../../models/user.model";
import { IUserDTO } from "../interfaces/user.dto";

export function mapUser(user: IUsers): IUserDTO {
    return {
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        address: user.address || null,
        profile_image: user.profile_image || "",
        status: user.status,
        role: user.role,
        authProvider: user.authProvider || "default",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}