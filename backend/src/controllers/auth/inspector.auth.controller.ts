import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IInspectorAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { TYPES } from "../../di/types";
import { IInspectorAuthService } from "../../core/interfaces/services/auth.service.interface";
import { HTTP_STATUS } from "../../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../../constants/http/response-messages";
import { responseUtils } from "../../utils/response.utils";
import { AppError } from "../../middlewares/context.middleware";

/**
 * InspectorAuthController - Thin Controller Implementation
 * 
 * Responsibilities:
 * - Route requests to service layer
 * - Set HTTP cookies where needed
 * - Return standardized responses
 * 
 * What's NOT here (moved to middleware/services):
 * ❌ Input validation (handled by Zod middleware)
 * ❌ Try-catch blocks (handled by express-async-errors + error middleware)
 * ❌ Error handling logic (handled by centralized error middleware)
 * ❌ Business logic (handled by service layer)
 */
@injectable()
export class InspectorAuthController implements IInspectorAuthController {
    constructor(
        @inject(TYPES.InspectorAuthService) private readonly _inspectorAuthService: IInspectorAuthService
    ) { }

    /**
     * Login inspector
     * POST /inspector/login
     * Validation: inspectorLoginSchema
     */
    login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await this._inspectorAuthService.login(email, password);

        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // Return access token, role and status (flat shape consumed by frontend loginUser thunk)
        const response = { accessToken, role: 'inspector', status: true }
        res.status(HTTP_STATUS.OK).json(response);
    }

    /**
     * Refresh access token using refresh token from cookie
     * POST /inspector/refresh
     */
    refreshToken = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError(
                HTTP_STATUS.UNAUTHORIZED,
                RESPONSE_MESSAGES.ERROR.REFRESH_TOKEN_MISSING
            );
        }

        const response = await this._inspectorAuthService.refreshToken(refreshToken);
        responseUtils.success(res, HTTP_STATUS.OK, undefined, response);
    }

    /**
     * Request password reset
     * POST /inspector/forget
     * Validation: forgetPasswordSchema
     */
    forgetPassword = async (req: Request, res: Response): Promise<void> => {
        const { email, role = 'inspector' } = req.body;
        const response = await this._inspectorAuthService.forgetPassword(email, role);
        responseUtils.success(res, HTTP_STATUS.OK, undefined, response);
    }

    /**
     * Register new inspector
     * POST /inspector/register
     * Validation: inspectorRegisterSchema
     */
    register = async (req: Request, res: Response): Promise<void> => {
        const { email, password, firstName, lastName, phone } = req.body;
        const response = await this._inspectorAuthService.registerInspector(
            email,
            password,
            firstName,
            lastName,
            phone
        );

        responseUtils.success(
            res,
            HTTP_STATUS.CREATED,
            RESPONSE_MESSAGES.SUCCESS.REGISTRATION_SUCCESSFUL,
            response
        );
    }

    /**
     * Verify OTP and complete registration
     * POST /inspector/verify-otp
     * Validation: verifyOTPSchema
     */
    verifyOTP = async (req: Request, res: Response): Promise<void> => {
        const { email, otp } = req.body;
        const { accessToken, refreshToken, message } = await this._inspectorAuthService.verifyOTP(email, otp);

        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // Return access token and message
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message,
            data: {
                accessToken
            }
        });
    }

    /**
     * Resend OTP to email
     * POST /inspector/resend-otp
     * Validation: resendOTPSchema
     */
    resendOTP = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
        const response = await this._inspectorAuthService.resendOTP(email);
        responseUtils.success(res, HTTP_STATUS.OK, undefined, response);
    }

    /**
     * Reset password using token
     * POST /inspector/reset
     * Validation: resetPasswordSchema
     */
    resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { token, email, password } = req.body;
        const response = await this._inspectorAuthService.resetPassword(token, email, password);
        responseUtils.success(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESSFUL,
            response
        );
    }
}
