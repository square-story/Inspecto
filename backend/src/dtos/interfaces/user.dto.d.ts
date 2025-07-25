export interface IUserDTO {
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
