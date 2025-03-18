import { Request, Response } from "express";
import { injectable } from "inversify";
import { getSignedImageUrl, getSignedPdfUrl } from "../utils/cloudinary.utils";

@injectable()
export class CloudinaryController {
    getSignedUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const { publicId, type } = req.query;
            if (!publicId || typeof publicId !== 'string') {
                res.status(400).json({ message: 'Public ID is required' });
                return;
            }
            const imageType = (type as string || 'none') as 'certificate' | 'signature' | 'face' | 'none';
            const signedUrl = getSignedImageUrl(publicId, imageType);
            res.status(200).json({ signedUrl });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            res.status(500).json({ message: 'Failed to generate signed URL' });
        }
    }
    getSignedPdfUrl = async (req:Request,res:Response):Promise<void>=>{
        try {
            const { pdfUrl } = req.query;
            if (!pdfUrl || typeof pdfUrl!=='string') {
                res.status(400).json({ message: 'Public ID is required' });
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
            res.status(200).json({ signedUrl });
        } catch (error) {
            console.error('Error generating signed PDF URL:', error);
            res.status(500).json({ 
                message: 'Failed to generate signed PDF URL',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}