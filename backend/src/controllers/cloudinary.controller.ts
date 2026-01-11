import { Request, Response } from "express";
import { injectable } from "inversify";
import { getSignedImageUrl, getSignedPdfUrl } from "../utils/cloudinary.utils";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";

@injectable()
export class CloudinaryController {
    getSignedUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const { publicId, type } = req.query;
            if (!publicId || typeof publicId !== 'string') {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INVALID_CREDENTIALS });
                return;
            }
            const imageType = (type as string || 'none') as 'certificate' | 'signature' | 'face' | 'none';
            const signedUrl = getSignedImageUrl(publicId, imageType);
            res.status(HTTP_STATUS.OK).json({ signedUrl });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
        }
    }
    getSignedPdfUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const { pdfUrl } = req.query;
            if (!pdfUrl || typeof pdfUrl !== 'string') {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INVALID_CREDENTIALS });
                return;
            }
            let publicId = ''
            const urlPattern = /\/upload\/v\d+\/(.+)$/;
            const match = pdfUrl.match(urlPattern);

            if (match && match[1]) {
                publicId = match[1];
            } else {
                // If the pattern doesn't match, use the entire URL as the public ID
                publicId = pdfUrl;
            }

            const signedUrl = getSignedPdfUrl(publicId);
            res.status(HTTP_STATUS.OK).json({ signedUrl });
        } catch (error) {
            console.error('Error generating signed PDF URL:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}