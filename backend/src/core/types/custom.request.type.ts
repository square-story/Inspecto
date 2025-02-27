import { Request } from "express";
import { UserRole } from "./user.role.type";

export interface CustomRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
    }
}