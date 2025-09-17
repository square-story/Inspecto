/**
 * Response Messages
 * 
 * This file contains constants for response messages used throughout the application.
 * Using these constants instead of hardcoded strings improves consistency and maintainability.
 */

export const RESPONSE_MESSAGES = {
  // Success Messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',
    OPERATION_SUCCESSFUL: 'Operation completed successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    STATUS_UPDATED: 'Status updated successfully',
    MARKED_AS_READ: 'Marked as read',
    USER_BLOCKED: 'User blocked successfully',
    USER_UNBLOCKED: 'User unblocked successfully',
    INSPECTOR_APPROVED: 'Inspector approved successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
    RESET_LINK_SENT: 'Reset link sent successfully',
    PASSWORD_RESET: 'Password reset successfully',
  },
  
  // Error Messages
  ERROR: {
    // General Errors
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request',
    VALIDATION_ERROR: 'Validation error',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    OPERATION_FAILED: 'Operation failed',
    INSPECTION_ALREADY_SUBMITTED: 'Inspection already submitted',
    POPULATED_INSPECTION_DATA_NOT_FOUND: 'Populated inspection data not found',
    FAILED_TO_UPLOAD_PDF_TO_CLOUDINARY: 'Failed to upload PDF to Cloudinary',
    FAILED_TO_UPLOAD_IMAGE_TO_CLOUDINARY: 'Failed to upload image to Cloudinary',
    
    // Authentication Errors
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_EXPIRED: 'Token expired',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_MISSING: 'Token missing',
    REFRESH_TOKEN_MISSING: 'Refresh token missing',
    ACCOUNT_BLOCKED: 'Account is blocked',
    INVALID_OTP: 'Invalid OTP',
    OTP_EXPIRED: 'OTP expired',
    
    // User Errors
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    PHONE_ALREADY_EXISTS: 'Phone number already exists',
    INVALID_USER_ID: 'Invalid user ID format',
    
    // Inspector Errors
    INSPECTOR_NOT_FOUND: 'Inspector not found',
    INSPECTOR_ALREADY_APPROVED: 'Inspector is already approved',
    INSPECTOR_ID_MISSING: 'Inspector ID is missing in the params',
    
    // Inspection Errors
    INSPECTION_NOT_FOUND: 'Inspection not found',
    INSPECTION_TYPE_NOT_FOUND: 'Inspection type not found',
    INSPECTION_TYPE_ID_MISSING: 'Inspection type ID is missing',
    
    // Payment Errors
    PAYMENT_FAILED: 'Payment failed',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    
    // Notification Errors
    NOTIFICATION_NOT_FOUND: 'Notification not found',
  }
};