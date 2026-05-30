import { z } from 'zod';

/**
 * Inspector Auth Validation Schemas
 * Comprehensive validation for all inspector authentication endpoints
 */

// Email validation with custom error messages
const emailSchema = z.string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim();

// Password validation with strength requirements
const passwordSchema = z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password is too long')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter');

// Phone validation for Indian numbers
const phoneSchema = z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Phone number contains invalid characters')
    .trim();

// Name validation
const nameSchema = z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim();

// OTP validation (6-digit numeric)
const otpSchema = z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers');

/**
 * Login validation
 */
export const inspectorLoginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(1, 'Password is required')
    })
});

/**
 * Registration validation with comprehensive field validation
 */
export const inspectorRegisterSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
        firstName: nameSchema,
        lastName: nameSchema,
        phone: phoneSchema
    })
});

/**
 * OTP verification
 */
export const verifyOTPSchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: otpSchema
    })
});

/**
 * Resend OTP
 */
export const resendOTPSchema = z.object({
    body: z.object({
        email: emailSchema
    })
});

/**
 * Forget password request
 */
export const forgetPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
        role: z.string().optional().default('inspector')
    })
});

/**
 * Reset password with token
 */
export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string()
            .min(1, 'Reset token is required')
            .trim(),
        email: emailSchema,
        password: passwordSchema
    })
});

/**
 * Refresh token validation (from cookies)
 * Note: Cookie validation happens in middleware
 */
export const refreshTokenSchema = z.object({
    cookies: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required')
    })
});

