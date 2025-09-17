import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http/status-codes';

/**
 * Response Utility
 * 
 * This utility provides standardized methods for API responses.
 * It ensures consistent response structure across the application.
 */

interface ApiResponse {
  success: boolean;
  message?: string;
  field?: string;
  data?: any;
  [key: string]: any; // For any additional fields
}

export const responseUtils = {
  /**
   * Send a success response
   * 
   * @param res Express Response object
   * @param statusCode HTTP status code (defaults to 200 OK)
   * @param message Success message
   * @param data Response data
   * @param additionalFields Any additional fields to include in the response
   */
  success: (
    res: Response,
    statusCode: number = HTTP_STATUS.OK,
    message?: string,
    data?: any,
    additionalFields?: Record<string, any>
  ): void => {
    const response: ApiResponse = {
      success: true,
      ...(message && { message }),
      ...(data && { data }),
      ...additionalFields
    };

    res.status(statusCode).json(response);
  },

  /**
   * Send an error response
   * 
   * @param res Express Response object
   * @param statusCode HTTP status code (defaults to 400 BAD REQUEST)
   * @param message Error message
   * @param field Field associated with the error (for validation errors)
   * @param additionalFields Any additional fields to include in the response
   */
  error: (
    res: Response,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    message: string,
    field?: string,
    additionalFields?: Record<string, any>
  ): void => {
    const response: ApiResponse = {
      success: false,
      message,
      ...(field && { field }),
      ...additionalFields
    };

    res.status(statusCode).json(response);
  }
};