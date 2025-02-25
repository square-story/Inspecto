import { Request, Response } from "express";

export interface IAuthController {
    login: (req: Request, res: Response) => Promise<void>;
    refreshToken: (req: Request, res: Response) => Promise<void>;
}

export type IAdminAuthController = IAuthController

export interface IUserAuthController extends IAuthController {
    googleLogin: (req: Request, res: Response) => Promise<void>
    register: (req: Request, res: Response) => Promise<void>;
    verifyOTP: (req: Request, res: Response) => Promise<void>;
    resendOTP: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
    forgetPassword: (req: Request, res: Response) => Promise<void>;
}

export interface IInspectorAuthController extends IAuthController {
    register: (req: Request, res: Response) => Promise<void>;
    verifyOTP: (req: Request, res: Response) => Promise<void>;
    resendOTP: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
    forgetPassword: (req: Request, res: Response) => Promise<void>;
}