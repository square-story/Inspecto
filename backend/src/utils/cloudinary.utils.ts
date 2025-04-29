import { v2 as cloudinary } from 'cloudinary';
import appConfig from '../config/app.config';
import { Readable } from 'stream';


cloudinary.config({
    cloud_name: appConfig.cloud_name,
    api_key: appConfig.api_key,
    api_secret: appConfig.api_secret,
});


interface CloudinarySignOptions {
    publicId: string;
    transformations?: string;
    expiresAt?: number; // Timestamp in seconds
}


/**
 * Generates a signed URL for a Cloudinary resource
 * @param options Configuration options for the signed URL
 * @returns Signed URL string
 */
export const generateSignedUrl = (options: CloudinarySignOptions): string => {
    const { publicId, transformations = '', expiresAt } = options;

    const expiration = expiresAt || Math.floor(Date.now() / 1000) + 3600;

    // Generate the signed URL
    const signedUrl = cloudinary.url(publicId, {
        secure: true,
        sign_url: true,
        transformation: transformations ? transformations.split(',') : [],
        expires_at: expiration
    });

    return signedUrl;
};


/**
 * Generates a signed URL with specific transformations for different image types
 * @param publicId Cloudinary public ID
 * @param type Type of image (certificate, signature, face, etc.)
 * @returns Signed URL with appropriate transformations
 */
export const getSignedImageUrl = (
    publicId: string,
    type: 'certificate' | 'signature' | 'face' | 'none' = 'none'
): string => {
    let transformations = '';

    switch (type) {
        case 'certificate':
            transformations = 'c_fill,w_800,h_600';
            break;
        case 'signature':
            transformations = 'c_crop,w_300,h_100,g_face';
            break;
        case 'face':
            transformations = 'c_crop,w_300,h_300,g_face';
            break;
        default:
            // No transformations
            break;
    }

    return generateSignedUrl({
        publicId,
        transformations,
        // Set expiration to 1 hour from now
        expiresAt: Math.floor(Date.now() / 1000) + 3600
    });
};


export const uploadToCloudinary = (
    buffer: Buffer,
    publicId: string,
    resourceType: 'image' | 'pdf' = 'image'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: resourceType === 'pdf' ? 'raw' : 'image',
                format: resourceType === 'pdf' ? 'pdf' : undefined,
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Upload failed'));
                resolve(result.secure_url);
            }
        );
        // Convert buffer to stream and pipe to uploadStream
        const readableStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            }
        });

        readableStream.pipe(uploadStream);
    });
}


export const getSignedPdfUrl = (publicId:string)=>{
    const timestamp = Math.floor(Date.now() / 1000);
    const expiresAt = timestamp + 3600;

    const signature = cloudinary.utils.private_download_url(
        publicId,
        'pdf',
        {
            resource_type: 'raw',
            type: 'upload',
            expires_at: expiresAt
        }
    );

    return signature
}