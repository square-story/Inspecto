import { Inspection } from "@/features/inspection/types";
import { IInspector } from "./inspector";
import { IUsers } from "@/app/UserManagement/columns";

export interface IReview {
    _id:string,
    inspector: IInspector;
    user: IUsers;
    inspection: Inspection;
    rating: number;
    comment: string;
    createdAt: Date;
}