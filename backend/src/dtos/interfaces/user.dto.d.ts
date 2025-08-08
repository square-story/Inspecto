export interface IUserDTO {
    _id: string; // Optional, as it may not be present in all user objects
    firstName: string;
    lastName: string;
    email: string;
    address: string | null;
    profile_image: string;
    status: boolean;
    role: string;
    authProvider: string;
    createdAt: Date;
    updatedAt: Date;
}
