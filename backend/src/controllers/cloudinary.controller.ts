import { Request, Response } from "express";
import { injectable } from "inversify";
import { getSignedImageUrl } from "../utils/cloudinary.utils";

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
}